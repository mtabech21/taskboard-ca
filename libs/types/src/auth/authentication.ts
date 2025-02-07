export type AuthenticationCredentialsType = 'email_password' | 'email_otp'

export type AuthenticationCredentials =
  { credentials_type: AuthenticationCredentialsType } & (
    EmailPasswordCredentials |
    EmailOTPCredentials
  )

export type EmailPasswordCredentials = {
  credentials_type: 'email_password'
  email: string,
  password: string
}

export type EmailOTPCredentials = {
  credentials_type: 'email_otp';
  email: string,
  otp: string
}

export type WithEncryptedPassword = {
  enc_pass: string
}