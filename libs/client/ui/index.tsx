import logo from '@assets/images/logo.svg'

export function TaskboardLogo(props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
  return (<img {...props} src={logo} alt='taskboard-logo' />)
}