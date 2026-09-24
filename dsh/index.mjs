import Schema from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { applyBidWorkbench } from '../src/plugin.mjs'

export const name = 'dsh-bid-workbench'
export const inject = ['connection', 'agents', 'desktopWorkbenchOwnership']
export const Config = Schema.object({
  root: Schema.string().required().description('投标作战室的本地业务数据目录。')
})

export function apply(ctx, config) {
  return applyBidWorkbench(ctx, config, { defineTool })
}
