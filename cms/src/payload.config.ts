import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { hu } from '@payloadcms/translations/languages/hu'
import { en } from '@payloadcms/translations/languages/en'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Authors } from './collections/Authors'
import { Categories } from './collections/Categories'
import { Posts } from './collections/Posts'
import { Deploys } from './collections/Deploys'
import { blogExport, health } from './endpoints'
import { startDeployWorker } from './lib/deploy'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const required = (name: string) => {
  const value = process.env[name]
  if (!value && process.env.NODE_ENV === 'production') throw new Error(`Missing required environment variable ${name}`)
  return value || ''
}

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Vizitor CMS', robots: 'noindex, nofollow' },
  },
  i18n: { supportedLanguages: { hu, en }, fallbackLanguage: 'hu' },
  collections: [Posts, Categories, Authors, Media, Users, Deploys],
  editor: lexicalEditor(),
  secret: required('PAYLOAD_SECRET'),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: required('DATABASE_URL') },
    // Production schema changes only through committed migrations (src/migrations).
    push: process.env.PAYLOAD_DB_PUSH === 'true',
    prodMigrations: migrations,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  csrf: (process.env.CSRF_ORIGINS || process.env.PAYLOAD_PUBLIC_SERVER_URL || '').split(',').filter(Boolean),
  cors: (process.env.CORS_ORIGINS || '').split(',').filter(Boolean),
  endpoints: [blogExport, health],
  graphQL: { disablePlaygroundInProduction: true },
  sharp,
  telemetry: false,
  onInit: async payload => { startDeployWorker(payload) },
})
