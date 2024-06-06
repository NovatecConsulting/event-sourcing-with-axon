/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

// Components
import { VBtn } from 'vuetify/components'
import { VDateInput } from 'vuetify/labs/VDateInput'

export default createVuetify({
  aliases: {
    VBtnAlt: VBtn
  },
  components: {
    VDateInput
  },
  // https://vuetifyjs.com/features/global-configuration/
  //   defaults: {
  //     global: {
  //       rounded: 'sm'
  //     },
  //     VAppBar: {
  //       flat: true
  //     },
  //     VBtn: {
  //       color: 'primary',
  //       height: 44,
  //       minWidth: 190
  //     },
  //     VBtnAlt: {
  //       color: 'primary',
  //       height: 48,
  //       minWidth: 190,
  //       variant: 'outlined'
  //     },
  //     VSheet: {
  //       color: '#212121'
  //     }
  //   },
  // https://vuetifyjs.com/features/theme/
  theme: {
    defaultTheme: 'light'
    // themes: {
    //   dark: {
    //     dark: false,
    //     colors: {
    //       primary: '#1697f6'
    //     }
    //   }
    // }
  }
})
