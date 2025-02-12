import { NextFunction, Request, Response, Router } from "express";
import jwt from 'jsonwebtoken'
import argon from 'argon2'
import { decrypt } from "../secret";
import { NewUser, User } from "@taskboard/types";
import { Auth } from "../tools/xms";

import { users } from "../queries/users";
import { db } from "..";

export const auth = new Auth({
  ACCESS_SECRET: String(process.env.ACCESS_SECRET),
  REFRESH_SECRET: String(process.env.REFRESH_SECRET)
})

export async function authorization(req: Request, res: Response, next: NextFunction) {
  const access_token = req.cookies.access as string
  try {
    const user = await auth.verify(access_token)
    res.locals.user = user
    next()
  } catch {
    try {
      const refresh_token = req.cookies.refresh as string
      const refreshExpiry = new Date()
      refreshExpiry.setDate(refreshExpiry.getDate() + 3)

      const {
        user,
        new_access_token,
        new_refresh_token
      } = await auth.refresh(refresh_token)

      res.locals.user = user;
      res
        .cookie('access', new_access_token, {
          sameSite: 'none',
          secure: true,
          httpOnly: false,
        }) //SESSION
        .cookie('refresh', new_refresh_token, {
          sameSite: 'none',
          secure: true,
          httpOnly: true,
          expires: refreshExpiry
        }) //3 DAYS
      next()
    }
    catch { res.status(403).send('Session Expired.') }
  }
}

const auth_route = Router()

auth_route
  .get('/company_registration_link', async (req, res, next) => {
    const key = req.query.key as string | undefined
    function genKey() {
      const length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let retVal = "";
      for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
    }
    try {
      if (key == 'new') {
        res.json([`${process.env.PORTAL_ORIGIN_URL}/register/company?key=${(await db.client.one(`INSERT INTO portal.company_registration_keys(key) VALUES ('${genKey()}') RETURNING key`)).key}`]).end()
      } else
        if (key == 'valid_list') {
          res.json([...(await db.client.manyOrNone(`SELECT * FROM portal.company_registration_keys WHERE valid = true`)).map((k) => {
            return `${process.env.PORTAL_ORIGIN_URL}/register/company?key=${k.key}`
          })]).end()
        } else {
          if (key)
            db.client.tx<string>(async (t) => {
              const result = await t.one<{ key: string, valid: boolean }>(`select * from portal.company_registration_keys where key = '${key}'`)
              if (result.key == key && result.valid) {
                t.none(`UPDATE portal.company_registration_keys SET valid = false WHERE key = '${key}'`)
                return result.key
              }
              throw 'Invalid key'
            })
              .then((k) => {
                const access_token = jwt.sign({ key: k }, auth.environment.ACCESS_SECRET, { expiresIn: '30s' })
                res
                  .status(200)
                  .json(access_token)
                  .end()
              })
              .catch((err) => next(err))
        }
    } catch (err) {
      next(err)
    }
  })

auth_route
  .get('/', async (req, res) => {
    const access_token = (req.cookies.access as string) ?? ''
    try { res.json(await auth.verify(access_token) as User).end() }
    catch {
      try {
        const refresh_token = req.cookies.refresh as string
        const refreshExpiry = new Date()
        refreshExpiry.setDate(refreshExpiry.getDate() + 3)

        const {
          user,
          new_access_token,
          new_refresh_token
        } = await auth.refresh(refresh_token)

        res
          .status(200)
          .cookie('access', new_access_token, {
            sameSite: 'none',
            secure: true,
            httpOnly: true,
          }) //SESSION
          .cookie('refresh', new_refresh_token, {
            sameSite: 'none',
            secure: true,
            httpOnly: true,
            expires: refreshExpiry
          }) //3 DAYS
          .json(user as User)
          .end()

      }
      catch { res.status(403).send('Session Expired.') }
    }
  })

auth_route
  .route('/login')
  .post(async (req, res) => {
    const { email, enc_pass } = req.body
    try {
      const user = await db.client.oneOrNone(`SELECT * FROM auth.users WHERE email = '${email}'`)
      if (!user) { res.sendStatus(401).end() } else {

        const valid = enc_pass && await argon.verify(user.password, decrypt(enc_pass))

        if (valid) {
          const access = auth.generate_access_token(user as User)
          const refresh = auth.generate_refresh_token(user as User)
          const refreshExpiry = new Date()
          refreshExpiry.setDate(refreshExpiry.getDate() + 3)
          res
            .status(200)
            .cookie('access', access, {
              sameSite: 'none',
              secure: true,
              httpOnly: true,
            })//SESSION
            .cookie('refresh', refresh, {
              sameSite: 'none',
              secure: true,
              httpOnly: true,
              expires: refreshExpiry
            })//3 DAYS
            .json({
              uuid: user.uuid,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
            } as User)
            .end()
        } else {
          res.sendStatus(403)
        }
      }
    } catch {
      res.sendStatus(503)
    }
  })

auth_route
  .route('/register')
  .post(async (req, res) => {
    const new_user = req.body as NewUser
    const user = await users.defined.new(new_user)
    const access = auth.generate_access_token(user as User)
    const refresh = auth.generate_refresh_token(user as User)
    const refreshExpiry = new Date()
    refreshExpiry.setDate(refreshExpiry.getDate() + 3)
    res
      .status(200)
      .cookie('access', access, {
        sameSite: 'none',
        secure: true,
        httpOnly: true,
      })//SESSION
      .cookie('refresh', refresh, {
        sameSite: 'none',
        secure: true,
        httpOnly: true,
        expires: refreshExpiry
      })//3 DAYS
      .json({
        uuid: user.uuid,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      } as User)
      .end()
  })

auth_route
  .delete('/logout', async (req, res) => {
    res
      .clearCookie('access', { sameSite: 'none', secure: true, httpOnly: true })
      .clearCookie('refresh', { sameSite: 'none', secure: true, httpOnly: true })
      .send()
  })

export default auth_route