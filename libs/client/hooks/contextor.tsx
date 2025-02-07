import { createContext, ReactNode, useContext } from "react";

export default class Contextor<TConfig, THook> {
  private _context = createContext<THook>({} as THook)


  private hook: (config: TConfig) => THook

  Provider(props: { value: THook, children: ReactNode }): ReactNode {
    const { Provider } = this._context
    return (
      <Provider value={props.value} children={props.children} />
    )
  }

  context(): THook {
    return useContext(this._context)
  }
  init(config: TConfig): THook {
    return this.hook(config)
  }

  constructor(hook: (config: TConfig) => THook) {
    this.hook = hook.bind(this)
    this.init = this.init.bind(this)
    this.Provider = this.Provider.bind(this)
  }
}









