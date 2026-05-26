/** @format */

import { PrismaClient, Prisma } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

const petCategoryData: Prisma.PetCategoryCreateInput[] = [
  { name: '狗', label: 'Dog' },
  { name: '猫', label: 'Cat' },
  { name: '鸟', label: 'Bird' },
  { name: '蛇', label: 'Snake' },
  { name: '狮子', label: 'Lion' },
  { name: '兔子', label: 'Rabbit' },
  { name: '仓鼠', label: 'Hamster' },
  { name: '乌龟', label: 'Turtle' },
  { name: '鱼', label: 'Fish' },
  { name: '鹦鹉', label: 'Parrot' },
  { name: '蜥蜴', label: 'Lizard' },
  { name: '雪貂', label: 'Ferret' },
  { name: '豚鼠', label: 'Guinea Pig' },
]

const userData: Prisma.UserCreateInput[] = [
  {
    nickname: 'alice',
    account: 'alice',
    age: 24,
    phone: '18800000001',
    password: 'alice123456',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    name: 'Alice',
    email: 'alice@prisma.io',
  },
  {
    nickname: 'bob',
    account: 'bob',
    age: 28,
    phone: '18800000002',
    password: 'bob123456',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    name: 'Bob',
    email: 'bob@prisma.io',
  },
  {
    nickname: 'cindy',
    account: 'cindy',
    age: 22,
    phone: '18800000003',
    password: 'cindy123456',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    name: 'Cindy',
    email: 'cindy@example.com',
  },
  {
    nickname: 'david',
    account: 'david',
    age: 31,
    phone: '18800000004',
    password: 'david123456',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    name: 'David',
    email: 'david@example.com',
  },
  {
    nickname: 'momo',
    account: 'momo',
    age: 26,
    phone: '18800000005',
    password: 'momo123456',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    name: 'Momo',
    email: 'momo@example.com',
  },
]

type PostSeedInput = {
  authorEmail: string
  title: string
  content: string
  published: boolean
  pictures: string[]
  video: string | null
  stars: number
  likes: number
  comments: number
}

const generatedPostTitles = [
  '狗狗洗澡后的护理清单',
  '猫砂盆摆放位置怎么选',
  '兔子换毛期的梳毛记录',
  '鱼缸灯光时间调整实验',
  '鹦鹉训练奖励怎么给',
  '蛇类蜕皮前后的观察',
  '仓鼠笼子布置小改造',
  '宠物外出包使用体验',
  '幼猫到家第一周记录',
  '狗狗召回训练日记',
  '兔子饮水量变化观察',
  '鱼缸水草修剪心得',
  '鹦鹉站架选择记录',
  '爬宠湿度管理小技巧',
  '仓鼠垫料厚度测试',
  '宠物体重记录模板',
  '猫咪挑食怎么办',
  '狗狗雨天散步装备',
  '兔子磨牙玩具对比',
  '鱼缸过滤棉更换周期',
  '鹦鹉晒太阳注意事项',
  '蛇类躲避屋大小选择',
  '仓鼠囤粮行为观察',
  '宠物照片拍摄小技巧',
  '猫咪夜间活动记录',
  '狗狗社会化训练心得',
  '兔子厕所训练进展',
  '鱼缸造景第一次尝试',
  '鹦鹉羽毛状态观察',
  '爬宠喂食频率记录',
  '仓鼠跑轮尺寸选择',
  '宠物急救包准备清单',
  '猫咪喝水器体验',
  '狗狗护爪膏使用记录',
  '兔子蔬菜搭配日记',
  '鱼缸新鱼入缸流程',
  '鹦鹉玩具轮换计划',
  '蛇类冬季温控记录',
  '仓鼠隧道玩具测评',
  '宠物日常清洁流程',
  '猫咪抓板偏好测试',
  '狗狗零食训练分量',
  '兔子活动围栏布置',
]

const postImageUrls = [
  'https://images.unsplash.com/photo-1552053831-71594a27632d',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006',
  'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308',
  'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5',
  'https://images.unsplash.com/photo-1552728089-57bdde30beb3',
  'https://images.unsplash.com/photo-1531386151447-fd76ad50012f',
  'https://images.unsplash.com/photo-1425082661705-1834bfd09dca',
]

const getPostPictures = (index: number) => [
  postImageUrls[index % postImageUrls.length],
  postImageUrls[(index + 1) % postImageUrls.length],
  postImageUrls[(index + 2) % postImageUrls.length],
]

const authorEmails = userData.map(user => user.email)

const generatedPostData: PostSeedInput[] = generatedPostTitles.map(
  (title, index) => ({
    authorEmail: authorEmails[index % authorEmails.length],
    title,
    content: `${title}，记录一次真实的照顾过程，也整理了几个后续可以继续优化的小细节。`,
    published: index % 9 !== 0,
    pictures: getPostPictures(index),
    video: null,
    stars: 8 + ((index * 7) % 36),
    likes: 18 + ((index * 11) % 92),
    comments: index < 18 ? 2 : 0,
  }),
)

const postData: PostSeedInput[] = [
  {
    authorEmail: 'alice@prisma.io',
    title: '第一次带狗狗去公园',
    content: '今天阳光很好，带毛孩子去了附近的草地，它一路都很兴奋。',
    published: true,
    pictures: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d',
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5',
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3',
      'https://images.unsplash.com/photo-1531386151447-fd76ad50012f',
      'https://images.unsplash.com/photo-1425082661705-1834bfd09dca',
    ],
    video: null,
    stars: 18,
    likes: 42,
    comments: 2,
  },
  {
    authorEmail: 'alice@prisma.io',
    title: '猫咪新玩具测评',
    content: '买了一个自动逗猫球，猫主子先嫌弃了十分钟，然后玩了一下午。',
    published: true,
    pictures: [
      'https://images.unsplash.com/photo-1574158622682-e40e69881006',
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5',
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3',
      'https://images.unsplash.com/photo-1531386151447-fd76ad50012f',
      'https://images.unsplash.com/photo-1425082661705-1834bfd09dca',
    ],
    video: null,
    stars: 11,
    likes: 28,
    comments: 0,
  },
  {
    authorEmail: 'bob@prisma.io',
    title: '新手养兔子的几个小经验',
    content: '饮食、清洁和活动空间都很重要，兔子比想象中更需要陪伴。',
    published: true,
    pictures: [
      'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308',
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5',
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3',
      'https://images.unsplash.com/photo-1531386151447-fd76ad50012f',
      'https://images.unsplash.com/photo-1425082661705-1834bfd09dca',
    ],
    video: null,
    stars: 24,
    likes: 65,
    comments: 2,
  },
  {
    authorEmail: 'bob@prisma.io',
    title: '水族箱换水记录',
    content: '这周调整了过滤系统，鱼的状态明显更稳定了。',
    published: false,
    pictures: [
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5',
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5',
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3',
      'https://images.unsplash.com/photo-1531386151447-fd76ad50012f',
      'https://images.unsplash.com/photo-1425082661705-1834bfd09dca',
    ],
    video: null,
    stars: 6,
    likes: 13,
    comments: 0,
  },
  {
    authorEmail: 'cindy@example.com',
    title: '鹦鹉学会的新词',
    content: '它今天突然学会说早上好，虽然发音还有点含糊。',
    published: true,
    pictures: getPostPictures(4),
    video: 'https://example.com/videos/parrot-good-morning.mp4',
    stars: 31,
    likes: 88,
    comments: 2,
  },
  {
    authorEmail: 'david@example.com',
    title: '关于蛇类饲养温度',
    content: '温控垫和温湿度计非常关键，环境稳定比频繁打扰更重要。',
    published: true,
    pictures: getPostPictures(5),
    video: null,
    stars: 16,
    likes: 37,
    comments: 0,
  },
  {
    authorEmail: 'momo@example.com',
    title: '仓鼠夜间活动观察',
    content: '晚上十点之后最活跃，滚轮、藏食和整理垫料都很频繁。',
    published: true,
    pictures: getPostPictures(6),
    video: null,
    stars: 9,
    likes: 21,
    comments: 0,
  },
  ...generatedPostData,
]

type CommentSeedInput = {
  postTitle: string
  commentList: {
    authorEmail: string
    content: string
  }[]
}

const featuredCommentData: CommentSeedInput[] = [
  {
    postTitle: '第一次带狗狗去公园',
    commentList: [
      {
        authorEmail: 'bob@prisma.io',
        content: '狗狗看起来一定很开心。',
      },
      {
        authorEmail: 'cindy@example.com',
        content: '这张照片的光线太好了。',
      },
    ],
  },
  {
    postTitle: '新手养兔子的几个小经验',
    commentList: [
      {
        authorEmail: 'alice@prisma.io',
        content: '饮食部分很有用，收藏了。',
      },
      {
        authorEmail: 'momo@example.com',
        content: '兔子确实需要很大的活动空间。',
      },
    ],
  },
  {
    postTitle: '鹦鹉学会的新词',
    commentList: [
      {
        authorEmail: 'david@example.com',
        content: '想看视频！',
      },
      {
        authorEmail: 'alice@prisma.io',
        content: '鹦鹉真的太聪明了。',
      },
    ],
  },
]

const generatedCommentData: CommentSeedInput[] = generatedPostTitles
  .slice(0, 18)
  .map((postTitle, index) => ({
    postTitle,
    commentList: [
      {
        authorEmail: authorEmails[(index + 1) % authorEmails.length],
        content: `这篇「${postTitle}」很实用，准备照着试一下。`,
      },
      {
        authorEmail: authorEmails[(index + 2) % authorEmails.length],
        content: '细节记录得很清楚，期待后续更新。',
      },
    ],
  }))

const commentData: CommentSeedInput[] = [
  ...featuredCommentData,
  ...generatedCommentData,
]

type PetSeedInput = {
  name: string
  age: number
  categoryLabel: string
  ownerEmail: string
  avatar: string | null
}

const petData: PetSeedInput[] = [
  {
    name: '奶茶',
    age: 3,
    categoryLabel: 'Dog',
    ownerEmail: 'alice@prisma.io',
    avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d',
  },
  {
    name: '芝麻',
    age: 2,
    categoryLabel: 'Cat',
    ownerEmail: 'alice@prisma.io',
    avatar: 'https://images.unsplash.com/photo-1574158622682-e40e69881006',
  },
  {
    name: '雪球',
    age: 1,
    categoryLabel: 'Rabbit',
    ownerEmail: 'bob@prisma.io',
    avatar: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308',
  },
  {
    name: '小蓝',
    age: 4,
    categoryLabel: 'Fish',
    ownerEmail: 'bob@prisma.io',
    avatar: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5',
  },
  {
    name: '豆豆',
    age: 2,
    categoryLabel: 'Parrot',
    ownerEmail: 'cindy@example.com',
    avatar: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3',
  },
  {
    name: '青竹',
    age: 5,
    categoryLabel: 'Snake',
    ownerEmail: 'david@example.com',
    avatar: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f',
  },
  {
    name: '壳壳',
    age: 8,
    categoryLabel: 'Turtle',
    ownerEmail: 'david@example.com',
    avatar: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f',
  },
  {
    name: '布丁',
    age: 1,
    categoryLabel: 'Hamster',
    ownerEmail: 'momo@example.com',
    avatar: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca',
  },
]

async function seedPetCategories() {
  for (const category of petCategoryData) {
    await prisma.petCategory.upsert({
      where: { label: category.label },
      update: { name: category.name },
      create: category,
    })
  }
}

async function seedUsers() {
  for (const user of userData) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        nickname: user.nickname,
        account: user.account,
        age: user.age,
        phone: user.phone,
        password: user.password,
        avatar: user.avatar,
        name: user.name,
      },
      create: user,
    })
  }
}

async function seedPosts() {
  for (const post of postData) {
    const existingPost = await prisma.post.findFirst({
      where: {
        title: post.title,
        author: {
          email: post.authorEmail,
        },
      },
    })

    const data = {
      title: post.title,
      content: post.content,
      published: post.published,
      pictures: post.pictures,
      video: post.video,
      stars: post.stars,
      likes: post.likes,
      comments: post.comments,
    }

    if (existingPost) {
      await prisma.post.update({
        where: { id: existingPost.id },
        data,
      })
    } else {
      await prisma.post.create({
        data: {
          ...data,
          author: {
            connect: { email: post.authorEmail },
          },
        },
      })
    }
  }
}

async function seedComments() {
  for (const item of commentData) {
    const post = await prisma.post.findFirst({
      where: { title: item.postTitle },
    })

    if (!post) {
      continue
    }

    for (const comment of item.commentList) {
      const existingComment = await prisma.comment.findFirst({
        where: {
          content: comment.content,
          postId: post.id,
          author: {
            email: comment.authorEmail,
          },
        },
      })

      if (!existingComment) {
        await prisma.comment.create({
          data: {
            content: comment.content,
            post: {
              connect: { id: post.id },
            },
            author: {
              connect: { email: comment.authorEmail },
            },
          },
        })
      }
    }
  }
}

async function seedPets() {
  for (const pet of petData) {
    const existingPet = await prisma.pet.findFirst({
      where: {
        name: pet.name,
        category: {
          label: pet.categoryLabel,
        },
      },
    })

    const data = {
      name: pet.name,
      age: pet.age,
      avatar: pet.avatar,
      category: {
        connect: { label: pet.categoryLabel },
      },
      user: {
        connect: { email: pet.ownerEmail },
      },
    }

    if (existingPet) {
      await prisma.pet.update({
        where: { id: existingPet.id },
        data,
      })
    } else {
      await prisma.pet.create({ data })
    }
  }
}

export async function main() {
  await seedPetCategories()
  await seedUsers()
  await seedPosts()
  await seedComments()
  await seedPets()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async error => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
