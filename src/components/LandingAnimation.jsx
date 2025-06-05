import React, { useRef, useEffect } from 'react'
import { animate, Timeline, stagger, svg, utils } from 'animejs'

const stages = ['Extract', 'Transform', 'Load', 'Validate', 'Expose']

export default function LandingAnimation({ onFinish }) {
  const svgRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    const svgEl = svgRef.current
    const titleEl = titleRef.current
    const w = window.innerWidth
    const h = window.innerHeight
    console.log('[LandingAnimation] useEffect start', { svgEl, titleEl })
    console.log('[LandingAnimation] window size', w, h)

    const initialPositions = stages.map((_, i) => ({
      x: ((i + 1) * w) / (stages.length + 1),
      y: h * 0.4,
    }))
    const finalPositions = [
      { x: w * 0.25, y: h * 0.3 },
      { x: w * 0.5, y: h * 0.3 },
      { x: w * 0.75, y: h * 0.3 },
      { x: w * 0.33, y: h * 0.6 },
      { x: w * 0.66, y: h * 0.6 },
    ]

    const nodeEntryDuration = 800
    const nodeEntryDelay = 200
    const lineDrawDuration = 800
    const lineDrawDelay = 200
    const dataFlowDuration = 1000
    const repositionDuration = 1000
    const typingSpeed = 150

    function startTyping() {
      console.log('[LandingAnimation] startTyping')
      const segments = ['>the', 'craft', 'lab<']
      let acc = ''
      segments
        .reduce(
          (seq, seg) =>
            seq.then(
              () =>
                animate({
                  targets: { val: 0 },
                  val: seg.length,
                  round: 1,
                  duration: seg.length * typingSpeed,
                  easing: 'linear',
                  update: (anim) => {
                    const cnt = anim.animations[0].currentValue
                    titleEl.innerHTML = acc + seg.slice(0, cnt)
                  },
                }).finished.then(() => {
                  acc += seg
                })
            ),
          Promise.resolve()
        )
        .then(onFinish)
    }
    const tl = new Timeline({ autoplay: true, complete: startTyping })
    console.log('[LandingAnimation] timeline created', tl)

    tl.add({
      begin: () => console.log(
        '[LandingAnimation] Stage 1 nodes:',
        svgEl.querySelectorAll('.node-circle').length
      ),
      targets: svgEl.querySelectorAll('.node-circle, .node-label'),
      opacity: [0, 1],
      translateY: [40, 0],
      duration: nodeEntryDuration,
      easing: 'easeOutQuad',
      delay: stagger(nodeEntryDelay),
    })
    .add({
      begin: () => {
        const lines = svgEl.querySelectorAll('.pipeline-line')
        console.log('[LandingAnimation] Stage 2 lines:', lines.length)
        lines.forEach(el => {
          const len = el.getTotalLength()
          el.style.strokeDasharray = len
        })
      },
      targets: svgEl.querySelectorAll('.pipeline-line'),
      strokeDashoffset: [el => el.getTotalLength(), 0],
      opacity: [0, 1],
      duration: lineDrawDuration,
      easing: 'easeOutSine',
      delay: stagger(lineDrawDelay),
    })
    .add({
      begin: () => {
        const dots = svgEl.querySelectorAll('.flow-dot')
        console.log('[LandingAnimation] Stage 3 dots:', dots.length)
        dots.forEach((dot, i) => {
          dot.style.opacity = 1
          const motionPath = svg.createMotionPath(`#line${i}`)
          animate({
            targets: dot,
            translateX: motionPath.translateX,
            translateY: motionPath.translateY,
            duration: dataFlowDuration,
            easing: 'linear',
          })
        })
      },
    })
    .add({
      begin: () => console.log('[LandingAnimation] Stage 4 reposition nodes'),
      targets: svgEl.querySelectorAll('.node-circle'),
      translateX: (el, i) => finalPositions[i].x - initialPositions[i].x,
      translateY: (el, i) => finalPositions[i].y - initialPositions[i].y,
      duration: repositionDuration,
      easing: 'easeInOutBack',
    }, '+=200')
    .add({
      targets: svgEl.querySelectorAll('.node-label'),
      translateX: (el, i) => finalPositions[i].x - initialPositions[i].x,
      translateY: (el, i) => finalPositions[i].y - initialPositions[i].y,
      duration: repositionDuration,
      easing: 'easeInOutBack',
    }, `-=${repositionDuration}`)
    .add({
      targets: svgEl.querySelectorAll('.pipeline-line'),
      x1: (el, i) => finalPositions[i].x,
      y1: (el, i) => finalPositions[i].y,
      x2: (el, i) => finalPositions[i + 1].x,
      y2: (el, i) => finalPositions[i + 1].y,
      duration: repositionDuration,
      easing: 'easeInOutBack',
    }, `-=${repositionDuration}`)

    return () => {
      // cleanup any running animations and timeline
      utils.remove(svgEl.querySelectorAll('*'))
      tl.pause()
    }
  }, [onFinish])

  // static layout for SVG
  const w = typeof window !== 'undefined' ? window.innerWidth : 0
  const h = typeof window !== 'undefined' ? window.innerHeight : 0
  const styles = getComputedStyle(document.documentElement)
  const colors = {
    green: styles.getPropertyValue('--dracula-green').trim(),
    pink: styles.getPropertyValue('--dracula-pink').trim(),
    cyan: styles.getPropertyValue('--dracula-cyan').trim(),
  }
  const initialPositions = stages.map((_, i) => ({
    x: ((i + 1) * w) / (stages.length + 1),
    y: h * 0.4,
  }))
  const getColor = (i) =>
    i < 3 ? colors.green : i === 3 ? colors.pink : colors.cyan

  return (
    <div className="landing-container">
      <svg ref={svgRef} width={w} height={h}>
        {initialPositions.map((pos, i) => (
          <circle
            key={`node-${i}`}
            className="node-circle"
            cx={pos.x}
            cy={pos.y}
            r={10}
            fill={getColor(i)}
          />
        ))}
        {initialPositions.slice(0, -1).map((_, i) => (
          <line
            key={`line${i}`}
            id={`line${i}`}
            className="pipeline-line"
            x1={initialPositions[i].x}
            y1={initialPositions[i].y}
            x2={initialPositions[i + 1].x}
            y2={initialPositions[i + 1].y}
            stroke={colors.green}
            strokeWidth="2"
          />
        ))}
        {initialPositions.slice(0, -1).map((_, i) => (
          <circle
            key={`dot-${i}`}
            className="flow-dot"
            cx={initialPositions[i].x}
            cy={initialPositions[i].y}
            r={4}
            fill={colors.green}
          />
        ))}
        {initialPositions.map((pos, i) => (
          <text
            key={`label-${i}`}
            className="node-label"
            x={pos.x}
            y={pos.y - 16}
            textAnchor="middle"
            fill={getColor(i)}
            fontSize="14"
            fontFamily="sans-serif"
          >
            {stages[i]}
          </text>
        ))}
        <text
          ref={titleRef}
          className="typing-text"
          x={w / 2}
          y={h * 0.2}
          textAnchor="middle"
          fill={colors.green}
          fontFamily="monospace"
          fontSize="48"
        />
      </svg>
    </div>
  )
}