<template>
    <form @submit="submit"
          class="container py-5"
          method="post"
    >
        <div class="row">
            <input :value="deviceName"
                   name="device_id"
                   type="hidden"
            >

            <div class="col-12 px-2">
                <div class="intro-container">
                    <h1>Questionnaire</h1>
                    <p>Thank you very much for participating!</p>
                    <p>
                        Please fill out this form. Your data will be submitted entirely anonymously and analyzed for use
                        in a bachelor thesis.
                    </p>
                    <p>Note: VR stands for Virtual Reality</p>
                </div>

                <fieldset>
                    <template>
                        <div class="form-row">
                            <div class="form-group card">
                                <label class="label card-header"
                                       for="arc_accessibility"
                                >
                                    <template v-if="$stats['remote_connection_type'] !== 'none'">
                                        You used a second device as a remote control. How easily accessible was that
                                        device?
                                    </template>
                                    <template v-else>
                                        You didn't use a second device as a remote control. Why?
                                    </template>
                                </label>
                                <div class="card-body">
                                    <select class="d-block custom-select"
                                            id="arc_accessibility"
                                            name="arc_accessibility"
                                            required
                                            v-model="arcAccessibility"
                                    >
                                        <option value="" disabled>Please select an option</option>

                                        <template v-if="$stats['remote_connection_type'] !== 'none'">
                                            <option value="own_device">It was my own device.</option>
                                            <option value="spare">It was a spare device within my household.
                                            </option>
                                            <option value="household">It was a device belonging to someone within my
                                                household.
                                            </option>
                                            <option value="close_person">I borrowed a nearby person's device.</option>
                                            <option value="other">None of the above.</option>
                                        </template>
                                        <template v-else>
                                            <option value="none">I had no access to a second device.</option>
                                            <option value="other">Another reason.</option>
                                        </template>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <template v-if="arcAccessibility === 'other'">
                            <div class="form-row">
                                <div class="form-group card">
                                    <label class="label card-header"
                                           for="arc_accessibility_other"
                                    >
                                        <template v-if="$stats['remote_connection_type'] !== 'none'">
                                            Please describe the circumstances under which you had access to a second
                                            device.
                                        </template>
                                        <template v-else>
                                            Please describe why you did not use a second device.
                                        </template>
                                    </label>
                                    <div class="card-body">
                                        <textarea class="d-block w-100"
                                                  id="arc_accessibility_other"
                                                  name="arc_accessibility_other"
                                                  required
                                                  rows="5"
                                        />
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>
                </fieldset>

                <fieldset>
                    <div class="form-row">
                        <div class="form-group card">
                            <p class="label card-header">
                                Have you experienced VR before?
                            </p>
                            <div class="card-body">
                                <div class="form-check">
                                    <input class="form-check-input"
                                           id="has_used_vr_before_true"
                                           name="has_used_vr_before"
                                           required
                                           type="radio"
                                           v-model="hasUsedVRBefore"
                                           value="true"
                                    >
                                    <label class="form-check-label"
                                           for="has_used_vr_before_true"
                                    >
                                        Yes
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input"
                                           id="has_used_vr_before_false"
                                           name="has_used_vr_before"
                                           required
                                           type="radio"
                                           v-model="hasUsedVRBefore"
                                           value="false"
                                    >
                                    <label class="form-check-label"
                                           for="has_used_vr_before_false"
                                    >
                                        No
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <template v-if="'false' === hasUsedVRBefore">
                        <div class="form-row">
                            <div class="form-group card">
                                <p class="label card-header">
                                    Would you now consider yourself more inclined to experience VR?
                                </p>
                                <div class="card-body">
                                    <div class="form-check">
                                        <input class="form-check-input"
                                               id="would_use_vr_after_true"
                                               name="would_use_vr_after"
                                               required
                                               type="radio"
                                               value="true"
                                        >
                                        <label class="form-check-label"
                                               for="would_use_vr_after_true"
                                        >
                                            Yes
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input"
                                               id="would_use_vr_after_false"
                                               name="would_use_vr_after"
                                               required
                                               type="radio"
                                               value="false"
                                        >
                                        <label class="form-check-label"
                                               for="would_use_vr_after_false"
                                        >
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <div class="form-row">
                        <div class="form-group card">
                            <p class="label card-header">
                                Have you experienced <b>browser based</b> VR before?
                            </p>
                            <div class="card-body">
                                <div class="form-check">
                                    <input class="form-check-input"
                                           id="has_used_web_vr_before_true"
                                           name="has_used_web_vr_before"
                                           required
                                           type="radio"
                                           v-model="hasUsedWebVRBefore"
                                           value="true"
                                    >
                                    <label class="form-check-label"
                                           for="has_used_web_vr_before_true"
                                    >
                                        Yes
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input"
                                           id="has_used_web_vr_before_false"
                                           name="has_used_web_vr_before"
                                           required
                                           type="radio"
                                           v-model="hasUsedWebVRBefore"
                                           value="false"
                                    >
                                    <label class="form-check-label"
                                           for="has_used_web_vr_before_false"
                                    >
                                        No
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <template v-if="'false' === hasUsedWebVRBefore">
                        <div class="form-row">
                            <div class="form-group card">
                                <p class="label card-header">
                                    Would you now consider yourself more inclined to experience <b>browser based</b> VR?
                                </p>
                                <div class="card-body">
                                    <div class="form-check">
                                        <input class="form-check-input"
                                               id="would_use_web_vr_after_true"
                                               name="would_use_web_vr_after"
                                               required
                                               type="radio"
                                               value="true"
                                        >
                                        <label class="form-check-label"
                                               for="would_use_web_vr_after_true"
                                        >
                                            Yes
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input"
                                               id="would_use_web_vr_after_false"
                                               name="would_use_web_vr_after"
                                               required
                                               type="radio"
                                               value="false"
                                        >
                                        <label class="form-check-label"
                                               for="would_use_web_vr_after_false"
                                        >
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </fieldset>

                <fieldset v-if="$stats['remote_connection_type'] !== 'none'">
                    <div class="form-row">
                        <div class="form-group card">
                            <label class="label card-header"
                                   for="ease_of_connection_arcs"
                            >
                                How easy or complicated was the process of connecting the second device?
                            </label>
                            <div class="card-body">
                                <div class="d-flex flex-row justify-content-start align-items-center">
                                    <span class="d-block pr-3 w-25 text-right">Complicated</span>
                                    <input class="d-block form-control-range"
                                           id="ease_of_connection_arcs"
                                           max="4"
                                           min="0"
                                           name="ease_of_connection_arcs"
                                           required
                                           type="range"
                                           value="2"
                                    >
                                    <span class="d-block pl-3 w-25">Easy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <div class="form-row">
                        <div class="form-group card">
                            <label class="label card-header"
                                   for="ease_of_interaction_arcs"
                            >
                                How easy or complicated was the <b>interaction</b> within this VR experience?
                                <small>
                                    Interaction: Typing codes into the door locks, swapping numbers.
                                </small>
                            </label>
                            <div class="card-body">
                                <div class="d-flex flex-row justify-content-start align-items-center">
                                    <span class="d-block pr-3 w-25 text-right">Complicated</span>
                                    <input class="d-block form-control-range"
                                           id="ease_of_interaction_arcs"
                                           max="4"
                                           min="0"
                                           name="ease_of_interaction_arcs"
                                           required
                                           type="range"
                                           value=""
                                    >
                                    <span class="d-block pl-3 w-25">Easy</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-row"
                         v-if="'true' === hasUsedVRBefore || 'true' === hasUsedWebVRBefore"
                    >
                        <div class="form-group card">
                            <label class="label card-header"
                                   for="ease_of_interaction_other"
                            >
                                How easy or complicated was the <b>interaction</b> within other VR experiences?
                            </label>
                            <div class="card-body">
                                <div class="d-flex flex-row justify-content-start align-items-center">
                                    <span class="d-block pr-3 w-25 text-right">Complicated</span>
                                    <input class="d-block form-control-range"
                                           id="ease_of_interaction_other"
                                           max="4"
                                           min="0"
                                           name="ease_of_interaction_other"
                                           required
                                           type="range"
                                           value="2"
                                    >
                                    <span class="d-block pl-3 w-25">Easy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <div class="form-row">
                        <div class="form-group card">
                            <label class="label card-header"
                                   for="ease_of_navigation_arcs"
                            >
                                How easy or complicated was the <b>navigation/movement</b> within this VR experience?
                                <small>
                                    Navigation: walking around the rooms, jumping up the stairs.
                                </small>
                            </label>
                            <div class="card-body">
                                <div class="d-flex flex-row justify-content-start align-items-center">
                                    <span class="d-block pr-3 w-25 text-right">Complicated</span>
                                    <input class="d-block form-control-range"
                                           id="ease_of_navigation_arcs"
                                           max="4"
                                           min="0"
                                           name="ease_of_navigation_arcs"
                                           required
                                           type="range"
                                           value="2"
                                    >
                                    <span class="d-block pl-3 w-25">Easy</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-row"
                         v-if="'true' === hasUsedVRBefore || 'true' === hasUsedWebVRBefore"
                    >
                        <div class="form-group card">
                            <label class="label card-header"
                                   for="ease_of_navigation_other"
                            >
                                How easy or complicated was the <b>navigation/movement</b> within other VR experiences?
                            </label>
                            <div class="card-body">
                                <div class="d-flex flex-row justify-content-start align-items-center">
                                    <span class="d-block pr-3 w-25 text-right">Complicated</span>
                                    <input class="d-block form-control-range"
                                           id="ease_of_navigation_other"
                                           max="4"
                                           min="0"
                                           name="ease_of_navigation_other"
                                           required
                                           type="range"
                                           value="2"
                                    >
                                    <span class="d-block pl-3 w-25">Easy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <div class="form-row">
                        <div class="form-group card">
                            <label class="label card-header"
                                   for="enjoyment_arcs"
                            >
                                Please rate your <b>enjoyment/frustration</b> within this VR experience.
                            </label>
                            <div class="card-body">
                                <div class="d-flex flex-row justify-content-start align-items-center">
                                    <span class="d-block pr-3 w-25 text-right">I was frustrated</span>
                                    <input class="d-block form-control-range"
                                           id="enjoyment_arcs"
                                           max="4"
                                           min="0"
                                           name="enjoyment_arcs"
                                           required
                                           type="range"
                                           value="2"
                                    >
                                    <span class="d-block pl-3 w-25">I enjoyed it</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-row"
                         v-if="'true' === hasUsedVRBefore || 'true' === hasUsedWebVRBefore"
                    >
                        <div class="form-group card">
                            <label class="label card-header"
                                   for="enjoyment_other"
                            >
                                Please rate your <b>enjoyment/frustration</b> within other VR experiences.
                            </label>
                            <div class="card-body">
                                <div class="d-flex flex-row justify-content-start align-items-center">
                                    <span class="d-block pr-3 w-25 text-right">I was frustrated</span>
                                    <input class="d-block form-control-range"
                                           id="enjoyment_other"
                                           max="4"
                                           min="0"
                                           name="enjoyment_other"
                                           required
                                           type="range"
                                           value="2"
                                    >
                                    <span class="d-block pl-3 w-25">I enjoyed it</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset v-if="$stats['remote_connection_type'] !== 'none'">
                    <div class="form-row">
                        <div class="form-group card">
                            <label class="label card-header"
                                   for="level_of_gaming"
                            >
                                How much experience do you have with console/PC gaming that requires handheld
                                controllers?
                            </label>
                            <div class="card-body">
                                <div class="d-flex flex-row justify-content-start align-items-center">
                                    <span class="d-block pr-3 w-25 text-right">None</span>
                                    <input class="d-block form-control-range"
                                           id="level_of_gaming"
                                           max="4"
                                           min="0"
                                           name="level_of_gaming"
                                           required
                                           type="range"
                                           value="2"
                                    >
                                    <span class="d-block pl-3 w-25">A lot</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <div class="form-row">
                        <div class="form-group card">
                            <label class="label card-header"
                                   for="physical_discomfort"
                            >
                                Did you experience any kind of nausea, motion sickness or other physical discomfort
                                during this VR experience?
                            </label>
                            <div class="card-body">
                                <div class="d-flex flex-row justify-content-start align-items-center">
                                    <span class="d-block pr-3 w-25 text-right">None</span>
                                    <input class="d-block form-control-range"
                                           id="physical_discomfort"
                                           max="4"
                                           min="0"
                                           name="physical_discomfort"
                                           required
                                           type="range"
                                           value="2"
                                    >
                                    <span class="d-block pl-3 w-25">A lot</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <div class="form-row">
                        <div class="form-group card">
                            <p class="label card-header">
                                Would you consider yourself to be a digital native, i.e. someone who is familiar
                                with computers and the Internet from an early age?
                            </p>
                            <div class="card-body">
                                <div class="form-check">
                                    <input class="form-check-input"
                                           id="digital_native_true"
                                           name="digital_native"
                                           required
                                           type="radio"
                                           value="true"
                                    >
                                    <label class="form-check-label"
                                           for="digital_native_true"
                                    >
                                        Yes
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input"
                                           id="digital_native_false"
                                           name="digital_native"
                                           required
                                           type="radio"
                                           value="false"
                                    >
                                    <label class="form-check-label"
                                           for="digital_native_false"
                                    >
                                        No
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <div class="form-row">
                        <div class="form-group card">
                            <label class="label card-header"
                                   for="age"
                            >
                                Please type in your age.
                            </label>
                            <div class="card-body">
                                <input class="d-block"
                                       id="age"
                                       name="age"
                                       required
                                       type="number"
                                >
                            </div>
                        </div>
                    </div>
                </fieldset>

                <div class="submit-container">
                    <template v-if="status === null">
                        <button class="btn btn-primary ml-auto d-flex"
                                type="submit"
                        >
                            Submit
                        </button>
                    </template>
                    <template v-else-if="status === 'loading'">
                        <p>
                            Submitting Data…
                        </p>
                    </template>
                    <template v-else>
                        <p>
                            Your data has been submitted. Have a great day!
                        </p>
                    </template>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
  export default {
    name: 'Questionnaire',

    data () {
      return {
        deviceName: null,
        arcAccessibility: '',
        hasUsedVRBefore: null,
        hasUsedWebVRBefore: null,
        status: null
      }
    },

    mounted () {
      this.deviceName = this.$stats['device_id'] || localStorage.getItem('arc-name') || null

      if (null === this.deviceName) {
        this.$router.push({name: 'index'})
      }

      document.documentElement.classList.remove('a-fullscreen')
    },

    methods: {
      async submit (event) {
        event.preventDefault()
        const data = Object.fromEntries(new FormData(this.$el))

        data['started_at'] = this.$stats['started_at']

        this.status    = 'loading'
        const response = await fetch('https://arc-stats.barthy.koeln/api/v1/questionnaire-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(data)
        })

        this.status = response.statusText
      }
    }
  }
</script>

<style lang="scss">
    $grid-gutter-width: .25rem;
    $form-grid-gutter-width: .25rem;

    @import '~bootstrap';
    @import '~arc-cd/src/cd';

    body {
        background-color: #d8d8d8;
    }

    fieldset {
        margin-bottom: 1rem;
    }

    .card {
        width: 100%;
    }

    * {
        font-family: $font-paragraph;
    }

    .label {
        display: block;
        width: 100%;
        max-width: 1080px;
        font-size: 1.2rem;
    }
</style>
