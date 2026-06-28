/** @format */

import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

export default function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className='text-base  font-normal'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          p: ({ children }) => <p className='mb-3 last:mb-0'>{children}</p>,
          ul: ({ children }) => (
            <ul className='mb-2 list-disc space-y-1 pl-5 last:mb-0'>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className='mb-2 list-decimal space-y-1 pl-5 last:mb-0'>
              {children}
            </ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => (
            <strong className='font-semibold'>
              {children}
              <br />
            </strong>
          ),
          code: ({ children }) => (
            <code className='rounded bg-muted px-1 py-0.5 text-xs'>
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className='mb-2 overflow-x-auto rounded-lg bg-muted p-3 text-xs last:mb-0'>
              {children}
            </pre>
          ),
        }}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
