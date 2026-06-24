# Upload Hook

## Responsibilities

- 上传逻辑应和表单 UI 解耦。
- 客户端负责选择文件、预览、上传进度、失败提示。
- 服务端负责鉴权、生成上传凭证、转换或保存文件信息。

## Existing API

- 上传接口：`app/api/upload/route.ts`
- 预签名接口：`app/api/presign/route.ts`
- HEIC 转换接口：`app/api/convert-heic/route.ts`
- 上传工具：`lib/upload.ts`

## Rules

- 上传前校验文件类型和大小。
- 不信任客户端传入的 MIME 和文件名。
- 需要展示的媒体 URL 应由服务端返回。
- 上传失败时给出可恢复状态，不提交半成品表单。
