/** @format */

interface IconProps {
  size?: number
  className?: string
}

export default function PawPrintIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}>
      {/* 大肉垫 */}
      <ellipse cx='12' cy='17' rx='4' ry='3' />
      {/* 四个小肉垫 */}
      <ellipse cx='6.5' cy='11.5' rx='2' ry='2.5' />
      <ellipse cx='17.5' cy='11.5' rx='2' ry='2.5' />
      <ellipse cx='9' cy='7' rx='1.5' ry='2' />
      <ellipse cx='15' cy='7' rx='1.5' ry='2' />
    </svg>
  )
}
