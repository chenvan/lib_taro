import Taro, { Component } from '@tarojs/taro'
import { View, Input, Picker, Icon } from '@tarojs/components'

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
  {
    key: '分类',
    value: 'book_type'
  },
]

export default class Search extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchField: searchFieldList[0],
      searchInfo: '',
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

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
      <View class='search-root'>
        <View class='search-box'>
          <Picker
            mode='selector'
            onChange={this.selectSearchField}
            range={searchFieldList}
            rangeKey='key'
            class='search-field-selector'
          >
            <View>
              {this.state.searchField.key}
            </View>
          </Picker>
          <Input 
            value={this.state.searchInfo}
            confirmType='search'
            onInput={this.catchInput}
            onConfirm={this.search}
            class='search-input'
          />
          <Icon 
            type='search'
            size='20'
            class='search-icon'
            // color='oragne'
            onClick={this.search}
          />
        </View>
      </View>
    )
  }
}
