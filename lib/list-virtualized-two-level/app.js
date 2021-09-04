
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
const VIEW_HEIGHT = 400
const ITEM_BORDER = 2
const ITEM_OFFSET_HEIGHT = (ITEM_HEIGHT + 2)
const SCROLL_HEIGHT = list.length * ITEM_OFFSET_HEIGHT
const VISIT_COUNT = Math.ceil(VIEW_HEIGHT / ITEM_OFFSET_HEIGHT)
const dataLength = 100

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
    insertDomByDate('head', 0, VISIT_COUNT)
}

/**
 * 移除 可视区域之外的节点
 * 
 * @param {string} type 'head' | 'tail'头部或尾部开始删除
 * @param {number} n 删除节点的数量
 */
function removeDomByDate (type, n) {
    const tableDom = document.getElementsByClassName('tableDom')[0]
    while (n--) {
        if (type === 'head') {
            tableDom.removeChild(tableDom.firstChild)
        } else if (type === 'tail') {
            tableDom.removeChild(tableDom.lastChild)
        }
    }
}

/**
 * 插入 新加入可视区域的节点
 * 
 * @param {string} type 'head' | 'tail'头部或尾部插入
 * @param {number} startIndex 插入的位置
 * @param {number} n 插入的数量
 */
function insertDomByDate (type, startIndex, n) {
    const tableDom = document.getElementsByClassName('tableDom')[0]
    const F = document.createDocumentFragment()

    if (type === 'head') {
        for (let i = 0; i < n; i++) {
            F.append(createTableItemDom(startIndex + i))
        }
        tableDom.insertBefore(F, tableDom.firstChild)
    } else if (type === 'tail') {
        for (let i = startIndex; i < startIndex + n; i++) {
            F.append(createTableItemDom(i))
        }
        tableDom.appendChild(F)
    }
}

function updateOffset (newStartIndex, newEndIndex) {
    const tableDom = document.getElementsByClassName('tableDom')[0]
    startIndex = newStartIndex
    endIndex = newEndIndex
    tableDom.style.transform = `translateY(${startIndex * ITEM_OFFSET_HEIGHT}px)`
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
            insertDomByDate('tail', endIndex + 1, offset)
            removeDomByDate('head', offset)
        } else if (offset < 0) {
            // 向上滚动，新增头部节点，删除尾部节点
            insertDomByDate('head', newStartIndex, -offset)
            removeDomByDate('tail', -offset)
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