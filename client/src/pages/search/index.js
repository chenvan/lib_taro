import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

import Search from '../../components/search/Search'
import Thumb from '../../components/thumb/Thumb'


const test = [
  {
    author: "青山裕企",
    book_type: "写真",
    cover: "https://img1.doubanio.com/view/subject/s/public/s4669517.jpg",
    title:  "スクールガール・コンプレックス",
    _id: "5cbab6c81515aaa537454518",
  }
]

export default class Index extends Component {

  config = {
    navigationBarTitleText: '搜索'
  }

  constructor (props) {
    super(props)
    this.state = {
      result: test
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onSuccess = res => {
    console.log('page', res)
    this.setState({
      result: this.state.result.concat(res)
    })
  }

  onError = err => {
    console.log('page', err)
  }

  render () {
    return (
      <View>
        <Search 
          onSuccess={this.onSuccess}
          onError={this.onError}
        />
        {
          this.state.result.map(res => {
            return (
              <Thumb 
                cover={res.cover}
                title={res.title}
                author={res.author}
                bookType={res.book_type}
                key={res._id}
              />
            )
          })
        }
      </View>
    )
  }
}
