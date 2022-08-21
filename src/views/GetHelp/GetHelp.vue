<script>
export default {
  mounted() {
    // stops an extra SS page from opening when we refer to this link on-site
    if (!new URLSearchParams(window.location.search).has('referrer')) {
      window.open('https://docs.google.com/forms/d/e/1FAIpQLScPaVlcJ0eWdt6N1WQ7FDLambjHbg8PWZml_SqAmxtAY0EvJg/viewform');
      this.$router.push('/');
    } else {
      window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLScPaVlcJ0eWdt6N1WQ7FDLambjHbg8PWZml_SqAmxtAY0EvJg/viewform';
    }
  },
};
</script>
