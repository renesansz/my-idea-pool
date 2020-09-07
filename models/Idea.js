import { getPropertyOrDefault } from '@/utils/model'

export const IMPACT_VALUE = {
  MIN: 1,
  MAX: 10
}
export const EASE_VALUE = {
  MIN: 1,
  MAX: 10
}
export const CONFIDENCE_VALUE = {
  MIN: 1,
  MAX: 10
}

function Idea(props) {
  this.id = getPropertyOrDefault(props, 'id', null)
  this.content = getPropertyOrDefault(props, 'content', '')
  this.impact = getPropertyOrDefault(props, 'impact', IMPACT_VALUE.MAX)
  this.ease = getPropertyOrDefault(props, 'ease', EASE_VALUE.MAX)
  this.confidence = getPropertyOrDefault(props, 'confidence', CONFIDENCE_VALUE.MAX)
  this.created_at = getPropertyOrDefault(props, 'created_at', 0)
  // Additional fields that can be used on manipulating the data in-memory
  this.editMode = getPropertyOrDefault(props, 'editMode', false)
  this.saving = false
  this.deleting = false

  // Getters
  Object.defineProperty(this, 'avgRating', {
    /**
     * Get calculated average of the idea.
     *
     * @returns {Number}
     */
    get() {
      const result = Number((this.impact + this.ease + this.confidence) / 3)
      return (result % 1 > 0) ? result.toFixed(1) : result.toFixed(0)
    }
  })

  Object.defineProperty(this, 'payload', {
    /**
     * Get formatted object to be used for API payload.
     *
     * @returns {Object}
     */
    get() {
      return {
        content: this.content,
        impact: this.impact,
        ease: this.ease,
        confidence: this.confidence
      }
    }
  })
}

export default Idea
