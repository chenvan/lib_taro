import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import './index.scss'

import Thumb from '../../components/thumb/Thumb'
import CustomButton from '../../components/button/Button'

@inject('user')
@observer
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
          uid: this.props.user._id
        }
      }
    }).then(res => {
      this.onSuccess(res.result.data, true)
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onSuccess = (data, isInit) => {
    Taro.hideLoading()
    if (isInit) {
      this.setState({
        status: 'success',
        result: data
      })
    } else {
      this.setState({
        result: data
      })
    }
    
  }

  onError = err => {
    Taro.hideLoading()
    console.log(err)
  }

  onClick = _id => {
    Taro.navigateTo({
      url: `../book/index?_id=${_id}`
    })
  }

  onDelete = (_id, title) => {
  
    Taro.showModal({
      title: title,
      content: '确认删除?'
    }).then(res => {
      if (res.confirm) {
        Taro.showLoading({
          title: '加载中...'
        })
    
        Taro.cloud.callFunction({
          name: "fav",
          data: {
            type: 'remove',
            data: {
              _id
            }
          }
        // eslint-disable-next-line no-shadow
        }).then(res => {
          if (res.result.stats.removed === 1) {
            this.onSuccess(this.state.result.filter(item => item._id !== _id))
          }
        }).catch(err => {
          this.onError(err)
        })
      }
    })
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
                  >
                    <CustomButton
                      className='custom-button'
                      onClick={this.onDelete.bind(this, res._id, res.title)}
                    >
                      删除
                    </CustomButton>
                  </Thumb>
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
