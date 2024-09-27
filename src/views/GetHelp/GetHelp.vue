<script>
export default {
  mounted() {
    // stops an extra SS page from opening when we refer to this link on-site
    if (!new URLSearchParams(window.location.search).has('referrer')) {
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSeCfuWhQ5f4jl0bzcEGJ6m6BGpnRkKJFEUW10knH0Olic_XAQ/viewform?usp=sf_link');
      this.$router.push('/');
    } else {
      window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSeCfuWhQ5f4jl0bzcEGJ6m6BGpnRkKJFEUW10knH0Olic_XAQ/viewform?usp=sf_link';
    }
  },
};
</script>
