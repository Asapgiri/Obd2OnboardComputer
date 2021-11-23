import { GlobalSettings } from "../../shared/global-settings"

export type initerFns = { service: string, stdout?: (data: string) => void, stderr?: (err: string) => void }

export class Initer {
  constructor(private spawn: any, private path: any, private appPath: string, private gs: GlobalSettings) { }

  public init(fns: initerFns): any {
    let init = this.spawn('node', [this.path.join(this.appPath, fns.service)])
    init.stdout.setEncoding('utf8')
    init.stderr.setEncoding('utf8')
    if (fns && fns.stdout) init.stdout.on('data', fns.stdout)
    if (fns && fns.stderr) init.stderr.on('data', fns.stderr)

    return init
  }
}
