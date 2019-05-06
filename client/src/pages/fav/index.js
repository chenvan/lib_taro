import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

import Thumb from '../../components/thumb/Thumb'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '收藏'
  }

  constructor (props) {
    super(props)
    this.state = {
      status: 'loading',
      result: [],
    }
  }

  componentWillMount () { }

  componentDidMount () { 
    Taro.showLoading({
      title: '加载中...'
    })

    Taro.cloud.callFunction({
      name: "fav",
      data: {
        type: 'get',
        data: {
          uid: '001960'
        }
      }
    }).then(res => {
      this.onSuccess(res.result.data)
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onSuccess = data => {
    Taro.hideLoading()
    this.setState({
      status: 'success',
      result: data
    })
  }

  onError = err => {
    console.log(err)
  }

  onClick = _id => {
    Taro.navigateTo({
      url: `../book/index?_id=${_id}`
    })
  }

  onDelete = _id => {
    console.log(_id)
  }

  render () {
    return (
      this.state.status !== 'loading' && (
        this.state.status === 'success' ? (
          <View class='root'>
            {
              this.state.result.map(res => {
                return (
                  <Thumb 
                    cover={res.cover}
                    title={res.title}
                    author={res.author}
                    bookType={res.book_type}
                    key={res._id}
                    onClick={this.onClick.bind(this, res.bid)}
                  />
                )
              })
            }
          </View>
        ) : (
          <View>
            Error
          </View>
        )
      )
    )
  }
}
