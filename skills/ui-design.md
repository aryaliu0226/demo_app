# UI Design Skill

## Theme

- Tailwind CSS v4 token 定义在 `ui/globals.css`。
- 主题色通过 CSS token 管理：

```css
:root {
  --background: #20202b;
  --foreground: #f0f0f0;
  --hover: rgba(242, 242, 242, 0.1);
}
```

- 组件里使用语义类，例如 `bg-background`、`bg-hover`、`text-muted-foreground`。
- 不要在单个元素上硬编码颜色。

## Typography

- `body` 已设置全局字体大小和字重。
- 子元素若与全局字体一致，不重复写 className。
- 只在样式与继承值不同时显式覆盖。

## Tailwind Class Order

1. 宽高：`w-*`、`h-*`、`min-w-*`、`max-h-*`
2. 字体：`text-*`、`font-*`、`leading-*`、`tracking-*`
3. Padding：`p-*`、`px-*`、`py-*`、`pt-*`
4. Margin：`m-*`、`mx-*`、`my-*`、`mt-*`
5. Flex / Grid：`flex`、`grid`、`items-*`、`justify-*`、`gap-*`
6. 其他：定位、颜色、边框、圆角、阴影、过渡

## Interaction

- 列表、按钮、表单状态要有 loading / disabled / error 处理。
- 不要让文本溢出按钮、卡片或导航。
- 保持现有布局风格，避免引入不一致的视觉系统。
