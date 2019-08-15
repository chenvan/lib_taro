import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'

import BookInfo from '../bookInfo/BookInfo'
import WButton from '../button/Button'
import ColumnHeader from '../columnHeader/ColumnHeader'
import WLoading from '../loading/Loading'
import PlaceHolder from '../placeHolder/PlaceHolder'

import refreshSrc from '../../assert/_ionicons_svg_md-refresh.svg'
import emptySrc  from '../../assert/empty.svg'
import errorSrc from '../../assert/error.svg'

import './index.scss'

export default class BorrowInfo extends Component {

  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)
    this.state = {
      status: 'loading',
      title: '',
      author: '',
      cover: '',
      bid: '',
      returnDate: '',
    }
  }

  componentDidMount () { 
    this.init()
  }

  componentDidUpdate (prevProps) {
    // console.log('borrow info: ', prevProps.uid, this.props.uid )
    if (prevProps.uid !== this.props.uid) {
      this.getBorrowingInfo(this.props.uid)
    }
  }

  onClick = _id => {
    Taro.navigateTo({
      url: `../../pages/book/index?_id=${_id}`
    })
  }

  init = () => {
    this.getBorrowingInfo(this.props.uid)
  }

  refreshInfo = () => {
    this.getBorrowingInfo(this.props.uid)
  }

  getBorrowingInfo = async uid => {
    // console.log(this.props.uid)
   
    let info = {}

    try {
      if (this.state.status !== 'loading') this.setState({ status: 'loading' })

      let { result } = await Taro.cloud.callFunction({ 
          name: 'borrowing', 
          data: { type: 'get', data: { uid } } 
        })
      
      // console.log(result)
      info = result.data
      info.status = 'success'

    } catch (err) {
      // err we should handle
      // 云函数混乱
      console.log(err)

      let msg = err.errMsg || err.message

      if (msg && msg.includes(`${uid} does not exist`)) {
        // console.log('in success')
        info.status = 'no-borrowing'
      } else {
        // err we do not handle
        info.status = 'fail'
      }
    }
    // console.log('get borrowing:', info)
    this.setState({
      status: info.status,
      title: info.title,
      author: info.author,
      cover: info.cover,
      returnDate: info.returnDate,
      bid: info.bid,
    })
  }

  render () {
    let { status, title, author, cover, returnDate, bid } = this.state

    return (
      <View class='borrow-info-root borrow-info'>
        <ColumnHeader title='正在借阅'>
          <WButton 
            onClick={this.refreshInfo}
            iconSize={48}
            src={refreshSrc}
          />
        </ColumnHeader>
        {
          status === 'loading' && (
            // <View class='loading'>
            //   加载中...
            // </View>
            <View className='loading'>
              <WLoading 
                loadingSize={64}
                color='orange'
              />
            </View>
            
          )
        }
        {
          status === 'success' && (
            <BookInfo 
              cover={cover}
              title={title}
              author={author}
              returnDate={returnDate.slice(0, 10)}
              onClick={this.onClick.bind(this, bid)}
            />
          )
        }
        {
          status === 'no-borrowing' && (
            <PlaceHolder 
              src={emptySrc}
            />
          ) 
        }
        {
          status === 'fail' && (
            <PlaceHolder 
              src={errorSrc}
            />
          )
        }
      </View>
    )
  }
}
