import { observable } from 'mobx'

const user = observable({
  name: undefined,
  uid: undefined,
})

export default user