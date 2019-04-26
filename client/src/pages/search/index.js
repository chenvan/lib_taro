import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
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
      result: test,
      hasMore: undefined,
      isLoading: false,
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
    this.setState({
      isLoading: false
    })
    console.log('page', err)
  }

  onSuccess = (data, isLoadMore) => {
    this.setState({
      result: isLoadMore ? this.state.result.concat(data) : data,
      hasMore: data.length === 10,
      pageIndex: isLoadMore ? this.state.pageIndex + 1 : 1,
      isLoading: false,
    })
  }

  onSearch = (field, info) => {
    // console.log(field, info)
    if (!this.state.isLoading) {
      this.setState({
        searchField: field,
        searchInfo: info,
        hasMore: undefined,
        isLoading: true
      })

      this.search(field, info, 0)
        .then(res => this.onSuccess(res.result.data, false))
        .catch(err => this.onError(err))
    }
  }


  search = (field, info, pageIndex) => {
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
    if (this.state.hasMore && !this.state.isLoading) {
      this.setState({
        isLoading: true
      })

      this.search(this.state.searchField, this.state.searchInfo, this.state.pageIndex)
        .then(res => this.onSuccess(res.result.data, true))
        .catch(err => this.onError(err))
    } 
  }

  render () {
    return (
      <View class='root'>
        <View class='header'>
          <Search 
            onSearch={this.onSearch}
          />
        </View>
        <View 
          class='main'
        >
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
        {
          this.state.hasMore === false && (
            <View>
              全部加载完成
            </View>
          )
        } 
        {
          this.state.isLoading && (
            <View>
              Loading
            </View>
          )
        }
      </View>
    )
  }
}
