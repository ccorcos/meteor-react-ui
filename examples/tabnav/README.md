# To Do

- lets add some nice animations and nice css
- don't forget routing!
- comment it up!


- then lets think about how to use any-db with this
  - publish unordered collections
  - publish reactive joins
  - client side subscription cache


// http://codepen.io/ccorcos/pen/jPzNpP

// no animation: http://codepen.io/ccorcos/pen/ZGRWwY
// push pop animation only: http://codepen.io/ccorcos/pen/yNEJyN
// here we are: http://codepen.io/ccorcos/pen/waXWWb
// with scroll: http://codepen.io/ccorcos/pen/rVKpOJ

// befroe the mixin: http://codepen.io/ccorcos/pen/LVrPwz?editors=001
// with the mixin: http://codepen.io/ccorcos/pen/vOrYGa



Some innate animations:

.navvc-appear-appear {
  opacity: 0.999;
}
.navvc-appear-appear.navvc-appear-appear-active {
  opacity: 1;
  transition: opacity .001s linear;
}
.navvc-instance-enter {
  opacity: 0.999;
}
.navvc-instance-enter.navvc-instance-enter-active {
  opacity: 1;
  transition: opacity .001s linear;
}
.navvc-instance-leave {
  opacity: 0.999;
}
.navvc-instance-leave.navvc-instance-leave-active {
  opacity: 1;
  transition: opacity .001s linear;
}
.navvc-push-enter {
  opacity: 0.999;
}
.navvc-push-enter.navvc-push-enter-active {
  opacity: 1;
  transition: opacity .001s linear;
}
.navvc-push-leave {
  opacity: 0.999;
}
.navvc-push-leave.navvc-push-leave-active {
  opacity: 1;
  transition: opacity .001s linear;
}
.navvc-pop-enter {
  opacity: 0.999;
}
.navvc-pop-enter.navvc-pop-enter-active {
  opacity: 1;
  transition: opacity .001s linear;
}
.navvc-pop-leave {
  opacity: 0.999;
}
.navvc-pop-leave.navvc-pop-leave-active {
  opacity: 1;
  transition: opacity .001s linear;
}





a more standard push pop animation:

// appear nearly instantly
.navvc-appear-appear {
  opacity: 0.1;
}
.navvc-appear-appear.navvc-appear-appear-active {
  opacity: 1;
  transition: opacity 0.01s ease;
}
// similar to appear
.navvc-instance-enter {
  z-index: 1;
  opacity: 0.1;
}
.navvc-instance-enter.navvc-instance-enter-active {
  opacity: 1;
  transition: opacity 0.01s ease;
}
.navvc-instance-leave {
  z-index: 0;
  opacity: 1;
}
.navvc-instance-leave.navvc-instance-leave-active {
  opacity: 0;
  transition: opacity 0.1s ease;
}
// push
.navvc-push-enter {
  z-index: 1;
  transform: translateX(100%);
}
.navvc-push-enter.navvc-push-enter-active {
  transform: translateX(0%);
  transition: transform .5s ease;
}
.navvc-push-leave {
  z-index: 0;
  transform: translateX(0%);
}
.navvc-push-leave.navvc-push-leave-active {
  transform: translateX(-33%);
  transition: transform .5s ease;
}
// pop
.navvc-pop-enter {
  transform: translateX(-33%);
}
.navvc-pop-enter.navvc-pop-enter-active {
  transform: translateX(0%);
  transition: transform .5s ease;
}
.navvc-pop-leave {
  transform: translateX(0%);
}
.navvc-pop-leave.navvc-pop-leave-active {
  transform: translateX(100%);
  transition: transform .5s ease;
}
