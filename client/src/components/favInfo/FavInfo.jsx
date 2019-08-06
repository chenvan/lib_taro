import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Switch } from '@tarojs/components'
// import { observer, inject } from '@tarojs/mobx'

import WButton from '../button/Button'
import ColumnHeader from '../columnHeader/ColumnHeader'
import BookThumb from '../bookThumb/BookThumb'


import './index.scss'

export default class FavInfo extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)
    this.state = {
      status: 'loading',
      deletable: false, 
      favList: [],
    }
  }

  componentDidMount () { 
    this.getFavList(this.props.uid)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.uid !== this.props.uid) {
      // 似乎不需要加 id
      this.setState({status: 'loading'})
      this.getFavList(nextProps.uid)
    }
  }

  getFavList = async uid => {
    try {
      let { result } = await Taro.cloud.callFunction({ name: "fav", data: { type: 'get', data: { uid } } })
      console.log(result)
      this.setState({
        status: 'success',
        favList: result.data
      })
    } catch (err) {
      this.onError(err)
    }
  }

  toggleState = event => {
    let deletable = event.detail.value 
    this.setState({ deletable })
  }

  onError = err => {
    // Taro.hideLoading()
    console.log(err)
  }

  onClick = bid => {
    Taro.navigateTo({
      url: `../book/index?_id=${bid}`
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
      <View className='fav-info-root fav-info'>
        <ColumnHeader title='收藏'>
          <Switch 
            color='orange'
            onChange={this.toggleState}
          />
        </ColumnHeader>
        {
          this.state.status === 'loading' && (
            <View>
              loading
            </View>
          )
        }
        {
          this.state.status === 'success' && (
            <ScrollView
              scrollX
              className='fav-list-root'
            >
              <View className='fav-list-container'> 
                { 
                  this.state.favList.map(favBook => {
                    return (
                      <BookThumb 
                        key={favBook._id}
                        title={favBook.title}
                        onClick={this.onClick.bind(this, favBook.bid)}
                        cover={favBook.cover}
                        width={200}
                        deletable={this.state.deletable}
                        onChange={this.onDelete.bind(this, favBook._id, favBook.title)}
                      />
                    )
                  })
                }
              </View>
            </ScrollView>
          )
        }
        
      </View>
    )
  }
}


  

  // render () {
  //   return (
  //     this.state.status !== 'loading' && (
  //       this.state.status === 'success' ? (
  //         <ListContainer>
  //           {
  //             this.state.result.map(res => {
  //               return (
  //                 <BookInfo 
  //                   cover={res.cover}
  //                   title={res.title}
  //                   author={res.author}
  //                   bookType={res.book_type}
  //                   key={res._id}
  //                   onClick={this.onClick.bind(this, res.bid)}
  //                 >
  //                   <CustomButton
  //                     className='custom-button'
  //                     onClick={this.onDelete.bind(this, res._id, res.title)}
  //                   >
  //                     删除
  //                   </CustomButton>
  //                 </BookInfo>
  //               )
  //             })
  //           }
  //         </ListContainer>
  //       ) : (
  //         <View>
  //           Error
  //         </View>
  //       )
  //     )
  //   )
  // }
