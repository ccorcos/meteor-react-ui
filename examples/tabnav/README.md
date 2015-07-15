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
  transition: opacity .001s linear;
}
.navvc-appear-appear.navvc-appear-appear-active {
  opacity: 1;
}
.navvc-push-enter {
  opacity: 0.999;
  transition: opacity .001s linear;
}
.navvc-push-enter.navvc-push-enter-active {
  opacity: 1;
}
.navvc-push-leave {
  opacity: 0.999;
  transition: opacity .001s linear;
}
.navvc-push-leave.navvc-push-leave-active {
  opacity: 1;
}
.navvc-pop-enter {
  opacity: 0.999;
  transition: opacity .001s linear;
}
.navvc-pop-enter.navvc-pop-enter-active {
  opacity: 1;
}
.navvc-pop-leave {
  opacity: 0.999;
  transition: opacity .001s linear;
}
.navvc-pop-leave.pop-leave-active {
  transform: translateX(100%);
}
.navvc-instance-enter {
  opacity: 0.999;
  transition: opacity .001s linear;
}
.navvc-instance-enter.navvc-instance-enter-active {
  opacity: 1;
}
.navvc-instance-leave {
  opacity: 0.999;
  transition: opacity .001s linear;
}
.navvc-instance-leave.instance-leave-active {
  opacity: 1;
}
