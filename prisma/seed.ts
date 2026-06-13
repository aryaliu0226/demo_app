/** @format */

import { PrismaClient, Prisma } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

// ─── PetCategory ─────────────────────────────────────────────────────────────

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

// ─── Role ─────────────────────────────────────────────────────────────────────

const roleData: Prisma.RoleCreateInput[] = [
  {
    name: 'Admin',
    label: '管理员',
    description: '拥有后台管理权限的用户角色',
  },
  {
    name: 'User',
    label: '普通用户',
    description: '默认普通用户角色',
  },
]

// ─── User ─────────────────────────────────────────────────────────────────────

type UserSeedInput = Prisma.UserCreateInput & {
  account: string
  email: string
  phone: string
  gender: string
  birthday: Date
}

const userData: UserSeedInput[] = [
  {
    nickname: 'alice',
    account: 'alice',
    age: 24,
    phone: '18800000001',
    password: 'alice123456',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    name: 'Alice',
    email: 'alice@prisma.io',
    brief: '喜欢带狗狗去城市公园，记录日常训练和户外散步。',
    address: '上海',
    gender: 'female',
    birthday: new Date('2000-03-15'),
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
    brief: '兔子和鱼缸双修玩家，偏爱整理新手饲养经验。',
    address: '杭州',
    gender: 'male',
    birthday: new Date('1996-07-22'),
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
    brief: '家有一只话很多的鹦鹉，分享鸟类训练和陪伴记录。',
    address: '成都',
    gender: 'female',
    birthday: new Date('2002-11-08'),
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
    brief: '爬宠爱好者，关注温湿度、环境稳定和低打扰饲养。',
    address: '广州',
    gender: 'male',
    birthday: new Date('1993-05-30'),
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
    brief: '仓鼠观察员，喜欢记录夜间活动和笼具改造。',
    address: '南京',
    gender: 'female',
    birthday: new Date('1998-09-04'),
  },
]

// ─── Follow ───────────────────────────────────────────────────────────────────

type FollowSeedInput = {
  followerEmail: string  // 关注者（我）
  followingEmail: string // 被关注者（对方）
}

// alice → bob, cindy
// bob   → alice, momo
// cindy → alice, david
// david → momo
// momo  → alice, bob, cindy
const followData: FollowSeedInput[] = [
  { followerEmail: 'alice@prisma.io',  followingEmail: 'bob@prisma.io' },
  { followerEmail: 'alice@prisma.io',  followingEmail: 'cindy@example.com' },
  { followerEmail: 'bob@prisma.io',    followingEmail: 'alice@prisma.io' },
  { followerEmail: 'bob@prisma.io',    followingEmail: 'momo@example.com' },
  { followerEmail: 'cindy@example.com',followingEmail: 'alice@prisma.io' },
  { followerEmail: 'cindy@example.com',followingEmail: 'david@example.com' },
  { followerEmail: 'david@example.com',followingEmail: 'momo@example.com' },
  { followerEmail: 'momo@example.com', followingEmail: 'alice@prisma.io' },
  { followerEmail: 'momo@example.com', followingEmail: 'bob@prisma.io' },
  { followerEmail: 'momo@example.com', followingEmail: 'cindy@example.com' },
]

// ─── Post ─────────────────────────────────────────────────────────────────────

type PostSeedInput = {
  authorEmail: string
  categoryLabel: string
  title: string
  content: string
  published: boolean
  pictures: string[]
  video: string | null
  stars: number
  likeCount: number
  comments: number
}

const postImageUrls = [
  'https://images.unsplash.com/photo-1552053831-71594a27632d',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006',
  'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308',
  'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5',
  'https://images.unsplash.com/photo-1552728089-57bdde30beb3',
  'https://images.unsplash.com/photo-1531386151447-fd76ad50012f',
  'https://images.unsplash.com/photo-1425082661705-1834bfd09dca',
]

const postCategoryLabels = [
  'Dog',
  'Cat',
  'Rabbit',
  'Fish',
  'Parrot',
  'Snake',
  'Hamster',
  'Turtle',
  'Bird',
  'Lizard',
  'Ferret',
  'Guinea Pig',
]

const getPostPictures = (index: number) => [
  postImageUrls[index % postImageUrls.length],
  postImageUrls[(index + 1) % postImageUrls.length],
  postImageUrls[(index + 2) % postImageUrls.length],
]

const authorEmails = userData
  .map(u => u.email)
  .filter((e): e is string => typeof e === 'string')

// 精选帖子（likeCount 与下方 likeData 对应）
const postData: PostSeedInput[] = [
  {
    authorEmail: 'alice@prisma.io',
    categoryLabel: 'Dog',
    title: '1. 第一次带狗狗去公园',
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
    stars: 3,
    likeCount: 4, // bob, cindy, momo, david
    comments: 2,
  },
  {
    authorEmail: 'alice@prisma.io',
    categoryLabel: 'Cat',
    title: '2. 猫咪新玩具测评',
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
    stars: 1,
    likeCount: 2, // bob, david
    comments: 0,
  },
  {
    authorEmail: 'bob@prisma.io',
    categoryLabel: 'Rabbit',
    title: '3. 新手养兔子的几个小经验',
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
    stars: 4,
    likeCount: 3, // alice, cindy, momo
    comments: 2,
  },
  {
    authorEmail: 'bob@prisma.io',
    categoryLabel: 'Fish',
    title: '4. 水族箱换水记录',
    content: '这周调整了过滤系统，鱼的状态明显更稳定了。',
    published: false,
    pictures: [
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5',
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3',
      'https://images.unsplash.com/photo-1531386151447-fd76ad50012f',
      'https://images.unsplash.com/photo-1425082661705-1834bfd09dca',
    ],
    video: null,
    stars: 0,
    likeCount: 0,
    comments: 0,
  },
  {
    authorEmail: 'cindy@example.com',
    categoryLabel: 'Parrot',
    title: '5. 鹦鹉学会的新词',
    content: '它今天突然学会说早上好，虽然发音还有点含糊。',
    published: true,
    pictures: getPostPictures(4),
    video: 'https://example.com/videos/parrot-good-morning.mp4',
    stars: 3,
    likeCount: 4, // alice, bob, david, momo
    comments: 2,
  },
  {
    authorEmail: 'david@example.com',
    categoryLabel: 'Snake',
    title: '6. 关于蛇类饲养温度',
    content: '温控垫和温湿度计非常关键，环境稳定比频繁打扰更重要。',
    published: true,
    pictures: getPostPictures(5),
    video: null,
    stars: 1,
    likeCount: 0,
    comments: 0,
  },
  {
    authorEmail: 'momo@example.com',
    categoryLabel: 'Hamster',
    title: '7. 仓鼠夜间活动观察',
    content: '晚上十点之后最活跃，滚轮、藏食和整理垫料都很频繁。',
    published: true,
    pictures: getPostPictures(6),
    video: null,
    stars: 2,
    likeCount: 2, // alice, bob
    comments: 0,
  },
]

// 批量生成帖子（不带 Like 记录，likeCount 为随机值）
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
  '鱼缸加热棒温度校准',
  '鹦鹉早晚作息记录',
  '蛇类饮水盆清洁频率',
  '仓鼠夏季降温方案',
  '宠物指甲修剪准备',
  '猫咪换粮过渡日记',
  '狗狗牵引绳选择心得',
  '兔子耳朵状态观察',
  '鱼缸藻类控制记录',
  '鹦鹉学口哨训练',
  '爬宠垫材更换体验',
  '仓鼠浴沙使用记录',
  '宠物出门体检清单',
  '猫咪窗边晒太阳记录',
  '狗狗坐下等待训练',
  '兔子草架摆放测试',
  '鱼缸夜灯使用体验',
  '鹦鹉换羽期护理',
  '蛇类喂食后的观察',
  '仓鼠饮水瓶漏水排查',
  '宠物房间除味方法',
  '猫咪航空箱适应训练',
  '狗狗独处训练进展',
  '兔子脚垫护理记录',
  '鱼缸硝化系统维护',
  '鹦鹉洗澡方式尝试',
  '爬宠晒背灯更换记录',
  '仓鼠木屑粉尘对比',
  '宠物相册整理计划',
  '猫咪梳毛手套测评',
  '狗狗冻干零食试吃',
  '兔子蔬菜清洗流程',
  '鱼缸水质测试记录',
  '鹦鹉笼内玩具布局',
  '蛇类夜间活动记录',
  '仓鼠新笼适应日记',
  '宠物雨季防潮清单',
  '猫咪猫爬架高度选择',
  '狗狗口腔清洁记录',
  '兔子换季保暖准备',
  '鱼缸底砂清理心得',
  '鹦鹉外出笼体验',
  '爬宠温区布置复盘',
  '仓鼠零食分量控制',
  '宠物智能喂食器体验',
  '猫咪睡姿观察记录',
  '狗狗训练口令整理',
  '兔子饮食禁忌笔记',
  '鱼缸新水草检疫记录',
  '鹦鹉亲人训练进展',
  '宠物搬家适应计划',
]

const generatedPostData: PostSeedInput[] = generatedPostTitles.map(
  (title, index) => ({
    authorEmail: authorEmails[index % authorEmails.length],
    categoryLabel: postCategoryLabels[index % postCategoryLabels.length],
    title,
    content: `${title}，记录一次真实的照顾过程，也整理了几个后续可以继续优化的小细节。`,
    published: index % 9 !== 0,
    pictures: getPostPictures(index),
    video: null,
    stars: 1 + ((index * 3) % 4),
    likeCount: 1 + ((index * 2) % 4),
    comments: index < 18 ? 2 : 0,
  }),
)

const allPostData: PostSeedInput[] = [...postData, ...generatedPostData]

// ─── Like ─────────────────────────────────────────────────────────────────────

type LikeSeedInput = {
  userEmail: string
  postTitle: string
}

// 与 postData 中的 likeCount 一一对应
const featuredLikeData: LikeSeedInput[] = [
  // 1. 第一次带狗狗去公园 (4)
  { userEmail: 'bob@prisma.io',     postTitle: '1. 第一次带狗狗去公园' },
  { userEmail: 'cindy@example.com', postTitle: '1. 第一次带狗狗去公园' },
  { userEmail: 'momo@example.com',  postTitle: '1. 第一次带狗狗去公园' },
  { userEmail: 'david@example.com', postTitle: '1. 第一次带狗狗去公园' },
  // 2. 猫咪新玩具测评 (2)
  { userEmail: 'bob@prisma.io',     postTitle: '2. 猫咪新玩具测评' },
  { userEmail: 'david@example.com', postTitle: '2. 猫咪新玩具测评' },
  // 3. 新手养兔子的几个小经验 (3)
  { userEmail: 'alice@prisma.io',   postTitle: '3. 新手养兔子的几个小经验' },
  { userEmail: 'cindy@example.com', postTitle: '3. 新手养兔子的几个小经验' },
  { userEmail: 'momo@example.com',  postTitle: '3. 新手养兔子的几个小经验' },
  // 5. 鹦鹉学会的新词 (4)
  { userEmail: 'alice@prisma.io',   postTitle: '5. 鹦鹉学会的新词' },
  { userEmail: 'bob@prisma.io',     postTitle: '5. 鹦鹉学会的新词' },
  { userEmail: 'david@example.com', postTitle: '5. 鹦鹉学会的新词' },
  { userEmail: 'momo@example.com',  postTitle: '5. 鹦鹉学会的新词' },
  // 7. 仓鼠夜间活动观察 (2)
  { userEmail: 'alice@prisma.io',   postTitle: '7. 仓鼠夜间活动观察' },
  { userEmail: 'bob@prisma.io',     postTitle: '7. 仓鼠夜间活动观察' },
]

const getInteractingEmails = (
  post: PostSeedInput,
  count: number,
  offset: number,
) => {
  const candidates = authorEmails.filter(email => email !== post.authorEmail)
  return Array.from({ length: Math.min(count, candidates.length) }, (_, index) => (
    candidates[(offset + index) % candidates.length]
  ))
}

const generatedLikeData: LikeSeedInput[] = generatedPostData.flatMap(
  (post, index) => (
    getInteractingEmails(post, post.likeCount, index).map(userEmail => ({
      userEmail,
      postTitle: post.title,
    }))
  ),
)

const likeData: LikeSeedInput[] = [
  ...featuredLikeData,
  ...generatedLikeData,
]

// ─── Favorite ─────────────────────────────────────────────────────────────────

type FavoriteSeedInput = {
  userEmail: string
  postTitle: string
}

const favoriteData: FavoriteSeedInput[] = allPostData.flatMap((post, index) => (
  getInteractingEmails(post, post.stars, index + 2).map(userEmail => ({
    userEmail,
    postTitle: post.title,
  }))
))

// ─── Comment ─────────────────────────────────────────────────────────────────

type CommentSeedInput = {
  postTitle: string
  commentList: { authorEmail: string; content: string }[]
}

const featuredCommentData: CommentSeedInput[] = [
  {
    postTitle: '1. 第一次带狗狗去公园',
    commentList: [
      { authorEmail: 'bob@prisma.io',     content: '狗狗看起来一定很开心。' },
      { authorEmail: 'cindy@example.com', content: '这张照片的光线太好了。' },
    ],
  },
  {
    postTitle: '3. 新手养兔子的几个小经验',
    commentList: [
      { authorEmail: 'alice@prisma.io',  content: '饮食部分很有用，收藏了。' },
      { authorEmail: 'momo@example.com', content: '兔子确实需要很大的活动空间。' },
    ],
  },
  {
    postTitle: '5. 鹦鹉学会的新词',
    commentList: [
      { authorEmail: 'david@example.com', content: '想看视频！' },
      { authorEmail: 'alice@prisma.io',   content: '鹦鹉真的太聪明了。' },
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

// ─── Pet ─────────────────────────────────────────────────────────────────────

type PetSeedInput = {
  name: string
  age: number
  categoryLabel: string
  ownerEmail: string
  avatar: string | null
  status: number
}

const petData: PetSeedInput[] = [
  { name: '奶茶', age: 3, categoryLabel: 'Dog',     ownerEmail: 'alice@prisma.io',   avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d', status: 1 },
  { name: '芝麻', age: 2, categoryLabel: 'Cat',     ownerEmail: 'alice@prisma.io',   avatar: 'https://images.unsplash.com/photo-1574158622682-e40e69881006', status: 1 },
  { name: '雪球', age: 1, categoryLabel: 'Rabbit',  ownerEmail: 'bob@prisma.io',     avatar: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308', status: 1 },
  { name: '小蓝', age: 4, categoryLabel: 'Fish',    ownerEmail: 'bob@prisma.io',     avatar: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5', status: 1 },
  { name: '豆豆', age: 2, categoryLabel: 'Parrot',  ownerEmail: 'cindy@example.com', avatar: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3', status: 1 },
  { name: '青竹', age: 5, categoryLabel: 'Snake',   ownerEmail: 'david@example.com', avatar: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f', status: 2 },
  { name: '壳壳', age: 8, categoryLabel: 'Turtle',  ownerEmail: 'david@example.com', avatar: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f', status: 1 },
  { name: '布丁', age: 1, categoryLabel: 'Hamster', ownerEmail: 'momo@example.com',  avatar: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca', status: 1 },
]

// ─── Seed Functions ───────────────────────────────────────────────────────────

async function seedPetCategories() {
  console.log('Seeding pet categories...')
  for (const category of petCategoryData) {
    await prisma.petCategory.upsert({
      where: { label: category.label },
      update: { name: category.name },
      create: category,
    })
  }
}

async function seedRoles() {
  console.log('Seeding roles...')
  for (const role of roleData) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {
        label: role.label,
        description: role.description,
      },
      create: role,
    })
  }
}

async function seedUsers() {
  console.log('Seeding users...')
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
        email: user.email,
        brief: user.brief,
        address: user.address,
        gender: user.gender,
        birthday: user.birthday,
      },
      create: user,
    })
  }
}

async function seedFollows() {
  console.log('Seeding follows...')
  for (const { followerEmail, followingEmail } of followData) {
    // connect 对隐式 M:N 是幂等的，重复执行不会报错
    await prisma.user.update({
      where: { email: followerEmail },
      data: {
        following: { connect: { email: followingEmail } },
      },
    })
  }

  // 按 followData 统计并更新冗余计数
  for (const user of userData) {
    const followingCount = followData.filter(
      f => f.followerEmail === user.email,
    ).length
    const followerCount = followData.filter(
      f => f.followingEmail === user.email,
    ).length

    await prisma.user.update({
      where: { email: user.email },
      data: { followingCount, followerCount },
    })
  }
}

async function seedPosts() {
  console.log('Seeding posts...')
  for (const post of allPostData) {
    const existing = await prisma.post.findFirst({
      where: { title: post.title, author: { email: post.authorEmail } },
    })

    const data = {
      title: post.title,
      content: post.content,
      published: post.published,
      pictures: post.pictures,
      video: post.video,
      stars: post.stars,
      likeCount: post.likeCount,
      comments: post.comments,
      category: { connect: { label: post.categoryLabel } },
    }

    if (existing) {
      await prisma.post.update({ where: { id: existing.id }, data })
    } else {
      await prisma.post.create({
        data: { ...data, author: { connect: { email: post.authorEmail } } },
      })
    }
  }
}

async function seedComments() {
  console.log('Seeding comments...')
  for (const item of commentData) {
    const post = await prisma.post.findFirst({ where: { title: item.postTitle } })
    if (!post) continue

    for (const comment of item.commentList) {
      const exists = await prisma.comment.findFirst({
        where: { content: comment.content, postId: post.id, author: { email: comment.authorEmail } },
      })
      if (!exists) {
        await prisma.comment.create({
          data: {
            content: comment.content,
            post:   { connect: { id: post.id } },
            author: { connect: { email: comment.authorEmail } },
          },
        })
      }
    }
  }
}

async function seedLikes() {
  console.log('Seeding likes...')
  for (const { userEmail, postTitle } of likeData) {
    const [user, post] = await Promise.all([
      prisma.user.findUnique({ where: { email: userEmail } }),
      prisma.post.findFirst({ where: { title: postTitle } }),
    ])
    if (!user || !post) continue

    // @@unique([userId, postId]) 保证幂等
    await prisma.like.upsert({
      where:  { userId_postId: { userId: user.id, postId: post.id } },
      update: {},
      create: { userId: user.id, postId: post.id },
    })
  }

  for (const postSeed of allPostData) {
    const post = await prisma.post.findFirst({
      where: { title: postSeed.title, author: { email: postSeed.authorEmail } },
    })
    if (!post) continue

    const likeCount = await prisma.like.count({ where: { postId: post.id } })
    await prisma.post.update({
      where: { id: post.id },
      data: { likeCount },
    })
  }

  // 按 Like 表统计每位作者收到的点赞数，更新 User.stars
  for (const user of userData) {
    const receivedLikes = await prisma.like.count({
      where: { post: { author: { email: user.email } } },
    })

    await prisma.user.update({
      where: { email: user.email },
      data: { stars: receivedLikes },
    })
  }
}

async function seedFavorites() {
  console.log('Seeding favorites...')
  for (const { userEmail, postTitle } of favoriteData) {
    const [user, post] = await Promise.all([
      prisma.user.findUnique({ where: { email: userEmail } }),
      prisma.post.findFirst({ where: { title: postTitle } }),
    ])
    if (!user || !post) continue

    await prisma.favorite.upsert({
      where:  { userId_postId: { userId: user.id, postId: post.id } },
      update: {},
      create: { userId: user.id, postId: post.id },
    })
  }

  for (const postSeed of allPostData) {
    const post = await prisma.post.findFirst({
      where: { title: postSeed.title, author: { email: postSeed.authorEmail } },
    })
    if (!post) continue

    const stars = await prisma.favorite.count({ where: { postId: post.id } })
    await prisma.post.update({
      where: { id: post.id },
      data: { stars },
    })
  }
}

async function seedPets() {
  console.log('Seeding pets...')
  for (const pet of petData) {
    const existing = await prisma.pet.findFirst({
      where: { name: pet.name, category: { label: pet.categoryLabel } },
    })

    const data = {
      name: pet.name,
      age: pet.age,
      avatar: pet.avatar,
      status: pet.status,
      category: { connect: { label: pet.categoryLabel } },
      user:     { connect: { email: pet.ownerEmail } },
    }

    if (existing) {
      await prisma.pet.update({ where: { id: existing.id }, data })
    } else {
      await prisma.pet.create({ data })
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export async function main() {
  await seedPetCategories()
  await seedRoles()
  await seedUsers()
  await seedFollows()
  await seedPosts()
  await seedComments()
  await seedLikes()
  await seedFavorites()
  await seedPets()
  console.log('Seed complete.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async error => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
