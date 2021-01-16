<script>
	const list = ["rmanky", "yourMom", "funnyName"];
</script>

<main class="hero is-dark is-fullheight">
	<div class="hero-body">
		<div class="container">
			<div class="columns">
				{#each list as room}
					<div class="column">
						<div class="card" style="display: flex; flex-direction: column; height: 100%;">
							<div class="card-content">
								<p class="title">
									{room} is live!
								</p>
								<p class="subtitle">Go ahead, tune in 😉</p>
							</div>
							<footer class="card-footer" style="margin-top: auto">
								<p class="card-footer-item">
									<a class="button is-link" href="/live/{room}"> Watch now! </a>
								</p>
							</footer>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</main>

<style>
</style>
