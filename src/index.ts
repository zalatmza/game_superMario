/**
 * Created by wconisan on 2018/2/1.
 */
import { Background } from './enginer/background'
import Player from './enginer/object/player'
import { stageSize, gameSize, playerSize, playerProp, key } from './enginer/const'
import { preRender, render } from './enginer/render'

const floorLevel = 400
// 程序入口
class GameMain {
  private stageX: number = stageSize.width
  // 主角
  private player: Player
  // 背景
  private background: Background
  // 游戏入口类构造函数
  constructor () {
    Laya.init(stageSize.width, stageSize.height)
    Laya.loader.load('./static/res/player.json',
                    Laya.Handler.create(this, this.onLoaded),
                    null,
                    Laya.Loader.ATLAS)
  }
  // 动画资源加载完成处理函数
  private onLoaded (): void {
    this.background = new Background()
    Laya.stage.addChild(this.background)
    this.player = new Player(0, 400)
    Laya.stage.addChild(this.player)
    preRender()
    Laya.timer.frameLoop(1, this, this.onLoop)
  }
  // 游戏主循环
  private onLoop () {
    this.setStageX()
    render(this.stageX)
  }

  private setStageX () {
    const left: boolean = this.player.keyState[key.left]
    const right: boolean = this.player.keyState[key.right]
    const up: boolean = this.player.keyState[key.up]

    if (up && !this.player.jumping) {
      this.player.jumping = true
    }

    if (this.player.jumping) {
      const newSpeedY = this.player.speedY + this.player.acce
      this.player.y = Math.round(this.player.y + (this.player.speedY + newSpeedY)/2)
      this.player.speedY = newSpeedY
      // floor需要加入碰撞检测
      this.player.y = Math.max(0 ,Math.min(this.player.y, floorLevel))
      if (this.player.y === floorLevel) {
        this.player.jumping = false
        this.player.speedY = playerProp.speedY
      }
    }

    if (left && right || !left && !right) {
      this.player.initAction()
    } else if (right) {
      // 在stage中的位置
      if (this.stageX >= gameSize.width - stageSize.width / 2) {
        this.stageX = Math.min(this.stageX, gameSize.width - stageSize.width / 2)
        this.player.x = Math.min(this.player.x + this.player.speedX, stageSize.width - playerSize.width)
      } else {
        this.player.x = Math.min(this.player.x + this.player.speedX, stageSize.width / 2)
        if (this.player.x === stageSize.width / 2) {
          this.stageX += this.player.speedX
        }
      }
      this.player.runDir = 1
      if (!(this.player.body.isPlaying && this.player.body._actionName === playerProp.action.right)) {
        this.player.playAnimation(playerProp.action.right)
      }
    } else if (left) {
      this.player.x -= this.player.speedX
      this.player.x = Math.max(this.player.x, 0)
      this.player.runDir = -1
      if (!(this.player.body.isPlaying && this.player.body._actionName === playerProp.action.left)) {
        this.player.playAnimation(playerProp.action.left)
      }
    }
  }
}
// 启动游戏
new GameMain()
