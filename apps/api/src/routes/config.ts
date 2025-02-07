import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'

export const API_URL = String(process.env.VITE_API_URL)
export const LANDING_URL = String(process.env.VITE_LANDING_URL)
export const HUB_URL = String(process.env.VITE_HUB_URL)
export const PORTAL_URL = String(process.env.VITE_PORTAL_URL)

const configurations = express.Router()

configurations.use(cors({ credentials: true, origin: [LANDING_URL, HUB_URL, PORTAL_URL,] }))
configurations.use(express.json())
configurations.use(cookieParser())

export default configurations
