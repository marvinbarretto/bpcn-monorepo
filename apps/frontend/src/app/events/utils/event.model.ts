import { Hero } from "../../shared/utils/image.model"
import { Seo } from "../../shared/utils/seo.model"

export interface IEventsRequest {
  data: IEvent
}

export interface IEventsResponse {
  data: IEvent[]
  meta: Meta
}

export interface IEventContentBlock {
  type: string
  level: number
  children: IEventContentBlockChild[]
}

export interface IEventContentBlockChild {
  text: string
  type: string
  bold?: boolean
  italic?: boolean
}

export interface IEvent {
  title: string
  slug: string
  content: IEventContentBlock[]
  date: string
  eventStatus: EventStatus
  hero?: Hero
  seo?: Seo
  location?: string
  id?: number
  documentId?: string
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
  locale?: any
}

export interface Meta {
  pagination: Pagination
}

export interface Pagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export enum EventStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  ARCHIVED = 'Archived'
}
