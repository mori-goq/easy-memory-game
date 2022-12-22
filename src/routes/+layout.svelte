<script>
  import 'bulma/css/bulma.min.css'
	import './styles.css'
</script>

<div class="app">
  <main>
		<slot />
	</main>
</div>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
