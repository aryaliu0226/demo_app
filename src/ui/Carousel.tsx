/** @format */

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'

export default function PostCarousel({
  pictures,
  video,
}: {
  pictures: string[]
  video?: string
}) {
  return (
    <Carousel>
      <CarouselContent>
        {pictures.map((url, index) => (
          <CarouselItem key={index}>
            <Image
              src={url}
              alt={`图片 ${index + 1}`}
              fill
              className='object-cover'
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
