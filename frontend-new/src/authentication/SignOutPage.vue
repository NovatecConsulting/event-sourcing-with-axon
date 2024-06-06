<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from 'vue3-oidc'

const { signoutRedirect } = useAuth()
onMounted(() => signoutRedirect())
</script>
