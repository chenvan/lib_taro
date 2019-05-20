import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '逾期名单'
  }

  constructor (props) {
    super(props)
    this.state = {
      result: [],
      hasMore: undefined,
      pageIndex: 0,
    }
  }

  componentWillMount () { }

  componentDidMount () { 
    this.getOutdated(this.state.pageIndex)
      .then(res => {
        console.log(res)
        this.onSuccess(res.result.data)
      })
      .catch(err => this.onError(err))
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }


  onError = err => {
    console.log('page', err)
    Taro.hideLoading()
  }

  onSuccess = (data, isLoadMore) => {
    this.setState({
      result: isLoadMore ? this.state.result.concat(data) : data,
      hasMore: data.length === 10,
      pageIndex: this.state.pageIndex + 1,
    })
    Taro.hideLoading()
  }


  getOutdated = pageIndex => {
    Taro.showLoading({
      title: '加载中...',
      mask: true
    })
    return Taro.cloud.callFunction({
      name: "borrowing",
      data: {
        type: 'outdated',
        data: {
          pageIndex
        }
      }
    })
  } 

  onReachBottom = () => {
    if (this.state.hasMore) {
      this.getOutdated(this.state.pageIndex)
        .then(res => this.onSuccess(res.result.data, true))
        .catch(err => this.onError(err))
    } 
  }


  render () {
    return (
      <View class='root'>
        <View class='main'>
          {
            this.state.result.map(record => {
              return (
                <View
                  class='outdated-record'
                  key={record._id}
                >
                  <View class='title'>{record.title}</View>
                  <View class='name'>{record.name}</View>
                  <View class='date'>{record.returnDate.slice(0, 10)}</View>
                </View>
              )
            })
          }
        </View>
        {
          this.state.hasMore === false && (
            <View class='footer'>
              NO MORE
            </View>
          )
        } 
      </View>
    )
  }
}
