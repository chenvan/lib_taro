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
      searchField: '',
      searchInfo: '',
    }
  }

  componentWillMount () { }

  componentDidMount () { }

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
      pageIndex: isLoadMore ? this.state.pageIndex + 1 : 1,
    })
    Taro.hideLoading()
  }

  onSearch = (field, info) => {
    // console.log(field, info)
    this.setState({
      searchField: field,
      searchInfo: info,
      hasMore: undefined,
    })

    this.search(field, info, 0)
      .then(res => this.onSuccess(res.result.data, false))
      .catch(err => this.onError(err))
  }

  search = (field, info, pageIndex) => {
    Taro.showLoading({
      title: '加载中...',
      mask: true
    })
    return Taro.cloud.callFunction({
      name: "book",
      data: {
        type: 'search',
        data: {
          searchField: field,
          searchInfo: info,
          pageIndex: pageIndex,
        }
      }
    })
  } 

  onReachBottom = () => {
    if (this.state.hasMore) {
      this.search(this.state.searchField, this.state.searchInfo, this.state.pageIndex)
        .then(res => this.onSuccess(res.result.data, true))
        .catch(err => this.onError(err))
    } 
  }


  render () {
    return (
      <View class='root'>
        
        <View class='main'>
          {
            this.state.result.map(res => {
              return (
                <View>{res}</View>
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
