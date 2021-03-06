import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Switch } from '@tarojs/components'

import ColumnHeader from '../columnHeader/ColumnHeader'
import BookThumb from '../bookThumb/BookThumb'
import WLoading from '../loading/Loading'
import PlaceHolder from '../placeHolder/PlaceHolder'

import emptySrc from '../../assert/empty.svg'

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
    Taro.eventCenter.on('get-fav-list', this.getFavList.bind(this, this.props.uid))
  }

  componentDidUpdate (prevProps) {
    if (prevProps.uid !== this.props.uid) {
      this.getFavList(this.props.uid)
    }
  }



  getFavList = async uid => {
    try {
      let { result } = await Taro.cloud.callFunction({ name: "fav", data: { type: 'get', data: { uid } } })
      // console.log(result)
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
    console.log(err)
  }

  onClick = bid => {
    Taro.navigateTo({
      url: `../book/index?_id=${bid}`
    })
  }

  onDelete = async (_id, title) => {
    try {
      let { confirm } = await Taro.showModal({ title, content: '确认删除?' })
      if (confirm) {
        let { result } = await Taro.cloud.callFunction({ name: 'fav', data: { type: 'remove', data: { _id } } })
        if (result.stats.removed === 1) {
          this.setState(preState => ({
            favList: preState.favList.filter(favBook => favBook._id !== _id)
          }))
        }
      }
    } catch (err) {
      this.onError(err)
    }
  }

  render () {
    const { isVisitor } = this.props
    
    return (
      <View className='fav-info-root fav-info'>
        <ColumnHeader title='收藏'>
          { 
            !isVisitor && (
              <Switch 
                color='orange'
                onChange={this.toggleState}
              />
            )
          }
        </ColumnHeader>
        {
          this.state.status === 'loading' && (
            <View className='loading'>
              <WLoading 
                loadingSize={64}
                color='orange'
              />
            </View>
          )
        }
        {
          this.state.status === 'success' && (
            this.state.favList.length === 0 ? (
              <PlaceHolder 
                src={emptySrc}
              />
            ) : (
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
                          onDelete={this.onDelete.bind(this, favBook._id, favBook.title)}
                        />
                      )
                    })
                  }
                </View>
              </ScrollView>
            )
          )
        }
      </View>
    )
  }
}
