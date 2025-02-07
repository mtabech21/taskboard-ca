
import { JWTString, User } from '@taskboard/types'
import jwt from 'jsonwebtoken'



export interface AuthenticationEnvironment {
  ACCESS_SECRET: string
  REFRESH_SECRET: string
}


export class HTTP {

}

export class Auth {
  environment: AuthenticationEnvironment
  constructor(env: AuthenticationEnvironment) { this.environment = env }

  generate_access_token(user: User) { return jwt.sign(user, this.environment.ACCESS_SECRET, { expiresIn: '30s' }) }
  generate_refresh_token(user: User) { return jwt.sign(user, this.environment.REFRESH_SECRET) }

  async refresh(refresh_token: JWTString<User>): Promise<{
    user: User,
    new_access_token: JWTString<User>,
    new_refresh_token: JWTString<User>
  }> {
    return new Promise((res, rej) => {
      jwt.verify(refresh_token, this.environment.REFRESH_SECRET, (err, user) => {
        if (err) { rej(new Error('Session Expired.')) } // XMSERROR
        else {
          res({
            user: user as User,
            new_access_token: this.generate_access_token(user as User),
            new_refresh_token: this.generate_refresh_token(user as User)
          })
        }
      })
    })
  }

  async verify(access_token: JWTString<User>): Promise<User> {
    return new Promise((res, rej) => {
      jwt.verify(access_token, this.environment.ACCESS_SECRET, (err, user) => {
        if (err) { rej(new Error('Invalid Token')) } else { // XMSERROR
          res(user as User)
        }
      })
    }
    )
  }
}

