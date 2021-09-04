
const list = new Array(10000).fill(true).map(() => ({
    id: faker.datatype.number(),
    name: faker.name.findName(),
    description: faker.name.jobTitle(),
    location: faker.address.city()
}));
/**
 * 全局变量
 */
const ITEM_HEIGHT = 25
const ITEM_BORDER = 2
const VIEW_HEIGHT = 400
const ITEM_OFFSET_HEIGHT = (ITEM_HEIGHT + 2)
const SCROLL_HEIGHT = list.length * ITEM_OFFSET_HEIGHT
const BUFFER_NUM = 10
const VISIT_COUNT = Math.ceil(VIEW_HEIGHT / ITEM_OFFSET_HEIGHT) + BUFFER_NUM

let startIndex = 0
let endIndex = 0

function render () {
    // 1. 创建 滚动区域
    initDom()
    // 2. 初始化 首屏数据，并渲染
    mountDom()
}

/**
 * 初次挂在试图
 */
function mountDom () {
    endIndex = startIndex + VISIT_COUNT - 1
    const tableDom = document.getElementsByClassName('tableDom')[0]
    const F = document.createDocumentFragment()
    for (let i = startIndex; i < startIndex + VISIT_COUNT; i++) {
        F.append(createTableItemDom(startIndex + i))
    }
    tableDom.insertBefore(F, tableDom.firstChild)
}

/**
 * 更新锚点位置，更新偏移量
 * 
 * @param {number} newStartIndex 新的 锚点位置
 * @param {*} newEndIndex 
 */
function updateOffset (newStartIndex, newEndIndex) {
    const tableDom = document.getElementsByClassName('tableDom')[0]
    startIndex = newStartIndex
    endIndex = newEndIndex
    tableDom.style.transform = `translateY(${startIndex * ITEM_OFFSET_HEIGHT}px)`
}

/**
 * 
 * @param {number} offset 偏移节点的数量
 */
function scrollToBottom (offset) {
    const tableDom = document.getElementsByClassName('tableDom')[0]
    const begin = endIndex + 1
    for (let i = begin; i < begin + offset; i++) {
        tableDom.append(createTableItemDom(i))
        tableDom.removeChild(tableDom.firstChild)
    }
}

/**
 * 
 * @param {number} offset 偏移节点的数量
 */

function scrollToTop (offset) {
    const tableDom = document.getElementsByClassName('tableDom')[0]
    const begin = startIndex - 1
    for (let i = begin; i > begin - offset; i--) {
        tableDom.insertBefore(createTableItemDom(i), tableDom.firstChild)
        tableDom.removeChild(tableDom.lastChild)
    }
}


/**
 *  滚动事件
 */
function scrollChange () {
    const scrollTop = document.getElementsByClassName('viewDom')[0].scrollTop

    let newStartIndex = scrollTop / ITEM_OFFSET_HEIGHT | 0
    let newEndIndex = newStartIndex + VISIT_COUNT - 1
    let offset = newStartIndex - startIndex
    if (offset !== 0) {
        if (offset > 0) {
            // 向下滚动，删除头部节点，新增尾部节点
            scrollToBottom(offset)
        } else if (offset < 0) {
            // 向上滚动，新增头部节点，删除尾部节点
            scrollToTop(-offset)
        }
        updateOffset(newStartIndex, newEndIndex)
    }
}

/**
 * 初始化 scroll、view
 */
function initDom () {
    const scrollDom = document.getElementsByClassName('scrollDom')[0]
    const viewDom = document.getElementsByClassName('viewDom')[0]
    viewDom.style.height = VIEW_HEIGHT + 'px'
    scrollDom.style.height = SCROLL_HEIGHT + 'px'

    const tableDom = document.getElementsByClassName('tableDom')[0]

    viewDom.addEventListener('scroll', scrollChange)
    return tableDom
}

/**
 * 根据索引 计算tableItem
 */
function createTableItemDom (index) {
    const it = list[index]
    const div = document.createElement('div')
    div.id = `item-${index}`
    div.style.height = ITEM_HEIGHT + 'px'
    div.className = 'tableItem'
    const name = document.createElement('span')
    name.style = "margin-left: 20px"
    const inx = document.createElement('span')
    inx.innerHTML = index + 1
    name.innerHTML = it.name
    div.appendChild(inx)
    div.appendChild(name)
    return div
}

render()