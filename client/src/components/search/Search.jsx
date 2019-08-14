import Taro, { Component } from '@tarojs/taro'
import { View, Input, Picker } from '@tarojs/components'

import WIcon from '../icon/Icon'
import WButton from '../button/Button'

import searchSrc from '../../assert/_ionicons_svg_md-search.svg'
import arrowRightSrc from '../../assert/_ionicons_svg_md-arrow-dropright.svg'

import './index.scss'

const searchFieldList = [
  {
    key: '书名',
    value: 'title',
  },
  {
    key: '作者',
    value: 'author'
  },
  // {
  //   key: '分类',
  //   value: 'type'
  // },
]

export default class SearchBox extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)
    this.state = {
      searchField: searchFieldList[0],
      searchInfo: '',
    }
  }

  selectSearchField = event => {
    this.setState({
      searchField: searchFieldList[event.detail.value]
    })
  }

  search = () => {
    this.props.onSearch && this.props.onSearch(this.state.searchField.value, this.state.searchInfo)
  }

  catchInput = event => {
    this.setState({
      searchInfo: event.detail.value
    })
  }

  render () {
    return (
      <View class='search-box-root search-box'>
        <WIcon 
          src={arrowRightSrc}
          iconSize={48}
        />
        <Picker
          mode='selector'
          onChange={this.selectSearchField}
          range={searchFieldList}
          rangeKey='key'
          className='picker'
        >
          <View>
            {this.state.searchField.key}
          </View>
        </Picker>
        <View className='sep'></View>
        <Input 
          value={this.state.searchInfo}
          confirmType='search'
          onInput={this.catchInput}
          onConfirm={this.search}
          className='search-input'
        />
        <WButton
          src={searchSrc}
          iconSize={48}
          onClick={this.search}
        />
      </View>
    )
  }
}
