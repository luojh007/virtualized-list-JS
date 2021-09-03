
const list = new Array(100).fill(true).map(() => ({
    id: faker.datatype.number(),
    name: faker.name.findName(),
    description: faker.name.jobTitle(),
    location: faker.address.city()
}));
const ITEM_HEIGHT = 25
const VIEW_HEIGHT = 400
const ITEM_BORDER = 2
const ITEM_OFFSET_HEIGHT = (ITEM_HEIGHT + 2)
const SCROLL_HEIGHT = list.length * ITEM_OFFSET_HEIGHT
const VISIT_COUNT = Math.ceil(VIEW_HEIGHT / ITEM_OFFSET_HEIGHT)

let startIndex = 0
let endIndex = 0
const dataLength = 100
function render () {
    // 1. 创建 滚动区域
    const tableDom = initDom()
    // 2. 初始化 首屏数据，并渲染
    const doms = initFirstDom()
    doms.map(it => tableDom.appendChild(it))
}


function initFirstDom () {
    endIndex = Math.ceil(VIEW_HEIGHT / (ITEM_HEIGHT + ITEM_BORDER)) - 1
    const res = []
    for (let i = startIndex; i <= endIndex; i++) {
        res.push(createTableItemDom(i))
    }
    return res
}

/**
 * 滚动监听事件，更新dom
 */
function updateDom () {
    const tableDom = document.getElementsByClassName('tableDom')[0]
    const F = document.createDocumentFragment()
    for (let i = startIndex; i <= endIndex; i++) {
        F.append(createTableItemDom(i))
    }
    tableDom.innerHTML = ''
    tableDom.append(F)
}

/**
 * 删除节点
 */
function scrollChange (n) {
    const tableDom = document.getElementsByClassName('tableDom')[0]
    const scrollTop = document.getElementsByClassName('viewDom')[0].scrollTop
    const h = ITEM_HEIGHT + ITEM_BORDER
    startIndex = scrollTop / h | 0
    endIndex = startIndex + VISIT_COUNT - 1

    updateDom()

    tableDom.style.transform = `translateY(${startIndex * h}px)`
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