# Style Guide

## 主题系统

主题色统一在 `src/ui/globals.css` 的 `:root` 中定义，只需修改这三行即可切换主题：

```css
:root {
  --background: #20202b;
  --foreground: #f0f0f0;
  --hover: rgba(242, 242, 242, 0.1);
}
```

组件里使用语义类（`bg-background`、`bg-hover`、`text-muted-foreground` 等），**不要在单个元素上硬编码颜色**。

## 全局字体

`body` 已设定 `text-md font-medium`，通过 `src/ui/globals.css` 的 `@layer base` 全局生效。

## 样式继承原则

子元素若与 body 字体大小、字重相同，**不需要重复写** className，让其自然继承即可。只在元素样式与继承值不同时才显式覆盖。

## Tailwind className 书写顺序

按以下顺序排列 className，保持一致性：

1. 宽高（`w-*`、`h-*`、`min-w-*`、`max-h-*` 等）
2. 字体（`text-*`、`font-*`、`leading-*`、`tracking-*`）
3. Padding（`p-*`、`px-*`、`py-*`、`pt-*` 等）
4. Margin（`m-*`、`mx-*`、`my-*`、`mt-*` 等）
5. Flex / Grid（`flex`、`grid`、`items-*`、`justify-*`、`gap-*`、`col-span-*` 等）
6. 其他（定位、颜色、边框、圆角、阴影、过渡等）
