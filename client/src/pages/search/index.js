import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import SearchBox from '../../components/search/Search'
import TypePicker from '../../components/typePicker/TypePicker'
import BookInfo from '../../components/bookInfo/BookInfo'
import ListContainer from '../../components/listContainer/ListContainer'

import './index.scss'

// const test = [
//   {
//     author: "青山裕企",
//     book_type: "写真",
//     cover: "https://img1.doubanio.com/view/subject/s/public/s4669517.jpg",
//     title:  "スクールガール・コンプレックス",
//     _id: "5cc15d291515aaa537798df8",
//   }
// ]

@inject('others')
@observer
export default class Index extends Component {

  config = {
    navigationBarTitleText: '搜索'
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

  onClick = _id => {
    Taro.navigateTo({
      url: `../book/index?_id=${_id}`
    })
  }

  render () {
    const { method } = this.$router.params
    return (
      <View class='root'>
        { 
          method === 'search' && (
            <SearchBox 
              onSearch={this.onSearch} 
            />
          )
        }
        { 
          method === 'type' && (
            <TypePicker 
              typeList={this.props.others.typeList}
              onSearch={this.onSearch}
            />
          )
        }
        <ListContainer
          hasMore={this.state.hasMore}
        >
          {
            this.state.result.map(res => {
              return (
                <BookInfo 
                  cover={res.cover}
                  title={res.title}
                  author={res.author}
                  bookType={res.book_type}
                  key={res._id}
                  onClick={this.onClick.bind(this, res._id)}
                />
              )
            })
          }
        </ListContainer>
      </View>
    )
  }
}
