/**
 * Created by Harry on 2018/2/11.
 */
import { playerProp } from '../const'
/* 碰撞检测，返回碰撞类型：-1 --> 没有碰撞,
                        3 --> obj1 位于 obj2上方,
                        2 --> obj1 位于 obj2下方,
                        1 --> obj1 位于 obj2左方,
                        0 --> obj1 位于 obj2右方 */
export function collisionCheck (obj1, obj2): number  {
  let cType: number = -1
  if (obj1.y < obj2.y && obj2.y - obj1.y <= obj1.height
    && Math.min(obj1.x + obj1.width, obj2.x + obj2.width) - Math.max(obj1.x, obj2.x) > playerProp.width * 0.2) {
    cType = 3
    return cType
  }
  if (obj1.y > obj2.y && obj1.y - obj2.y < obj2.height && obj1.y + obj1.height >= obj2.y + obj2.height
    && Math.min(obj1.x + obj1.width, obj2.x + obj2.width) - Math.max(obj1.x, obj2.x) > playerProp.width * 0.2) {
    cType = 2
    return cType
  }
  if (obj1.x < obj2.x && obj2.x - obj1.x <= obj1.width
      && Math.min(obj1.y + obj1.height, obj2.y + obj2.height) - Math.max(obj1.y, obj2.y) > playerProp.acce) {
    cType = 1
    return cType
  }
  if (obj1.x > obj2.x && obj1.x - obj2.x <= obj2.width
    && Math.min(obj1.y + obj1.height, obj2.y + obj2.height) - Math.max(obj1.y, obj2.y) > playerProp.acce) {
    cType = 0
    return cType
  }
  return cType
}

// 边缘检测
export function marginCheck (obj1, obj2) {
  let mType: number = -1
  const newObj1 = Object.assign({
    x: obj1.x,
    y: obj1.y,
    width: obj1.width,
    height: obj1.height
  }, obj1)
  newObj1.x += obj1.width * obj1.runDir
  mType = collisionCheck(newObj1, obj2)
  return mType
}
