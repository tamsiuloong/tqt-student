import { post, postWithAuth ,simplePost} from '@/utils/request'

export default {
  login: query => postWithAuth(`/oauth/token`, query),
  logout: query => simplePost(`/logout`, query)
}
