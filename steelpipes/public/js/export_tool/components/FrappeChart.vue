<template>
  <div>
    <nav class="navbar navbar-light">
      <form class="form-inline">
        <button
          type="button"
          class="btn btn-default btn-sm dropdown-toggle"
          data-toggle="dropdown"
          aria-expanded="true"
        >
          <span class="hidden-xs">
            <span class="menu-btn-group-label" data-label="Select Period">
              <span class="alt-underline">S</span>elect Period
            </span>
            <span class="caret"></span>
          </span>
          <span class="visible-xs">
            <i class="octicon octicon-triangle-down"></i>
          </span>
        </button>
        <ul class="dropdown-menu" role="Select Period">
          <li class="user-action" v-for="duration in durations" :key="duration.id">
            <a class="grey-link dropdown-item" href="#" onclick="return false;" v-on:click="gchart">
              <span class="menu-item-label" data-label="Stock Entry">
                <span class="alt-underline"></span>
                {{ duration }}
              </span>
            </a>
          </li>
        </ul>
        <span
          v-on:click="changeResolution"
          class="btn btn-primary float-right"
          type="button"
        >Add Data Points</span>
        <span
          v-on:click="changeResolution"
          class="btn btn-primary float-right"
          type="button"
        >Remove Data Points</span>
        <span
          v-on:click="exportChart"
          class="btn btn-warning float-right"
          type="button"
        >Export Charts</span>
      </form>
    </nav>
    <div>
      Period:
      <strong>{{ period }}</strong>
    </div>
    <div id="totalPipeSold"></div>
    <div id="individualPipeSold"></div>
    <div id="thicknessPipeSold"></div>
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></loading>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
export default {
  data: function() {
    return {
      isLoading: false,
      fullPage: true,
      time: 0,
      durations: [
        "This Month",
        "This Quarter",
        "This Year",
        "Last Month",
        "Last Quarter",
        "Last Year"
      ],
      period: "Not Selected",
      resolution: 1,
      total_pipe_sold_chart: null,
      total_pipe_sold_data: null,
      individual_pipe_sold_chart: null,
      individual_pipe_sold_data: null,
      thickness_pipe_sold_chart: null,
      thickness_pipe_sold_data: null
    };
  },
  components: {
    Loading
  },
  computed: {},
  methods: {
    gchart: function(event) {
      this.isLoading = true;
      this.period = event.toElement.innerText;
      // Calling method to fetch data
      frappe
        .call({
          method:
            "steelpipes.sp_dashboard.page.havenir_insight.havenir_insight.generate_total_pipe_labels_and_data_sets",
          args: {
            period: this.period,
            resolution: this.resolution
          }
        })
        .then(r => {
          this.total_pipe_sold_data = r.message[0];
          this.individual_pipe_sold_data = r.message[1];
          this.thickness_pipe_sold_data = r.message[2];
        })
        .then(() => {
          this.total_pipe_sold_chart = new frappe.Chart("#totalPipeSold", {
            data: this.total_pipe_sold_data,
            title: "Total Pipes Sold in MT",
            type: "line",
            // height: 350,
            lineOptions: {
              dotSize: 6, // default: 4
              regionFill: 1, // default: 0
              xIsSeries: true,
              heatline: 1 // default: 0
            },
            tooltipOptions: {
              formatTooltipX: d => {
                if (
                  this.resolution == 2 &&
                  this.period.includes("Month") &&
                  !d.includes("Week")
                ) {
                  return "Day " + d;
                } else {
                  return d;
                }
              },
              formatTooltipY: d => d + " MT"
            },
            colors: ["green"]
            // isNavigable: true
          });
          this.total_pipe_sold_chart.parent.addEventListener(
            "data-select",
            e => {
              console.log(
                "Index: " +
                  e.index +
                  " | Label: " +
                  e.label +
                  " | Value: " +
                  e.values[0]
              );
              //changing data set:
            }
          );
          this.individual_pipe_sold_chart = new frappe.Chart(
            "#individualPipeSold",
            {
              data: this.individual_pipe_sold_data,
              title: "Individual Pipes Sold in MT",
              type: "bar",
              tooltipOptions: {
                formatTooltipY: d => d + " MT"
              },
              colors: ["blue"]
            }
          );
          this.thickness_pipe_sold_chart = new frappe.Chart(
            "#thicknessPipeSold",
            {
              data: this.thickness_pipe_sold_data,
              title: "Thickness Sold in MT",
              type: "bar",
              colors: ["orange"]
            }
          );
        })
        .then(r => {
          this.isLoading = false;
        });
    },
    changeResolution: function(event) {
      if (
        this.resolution >= 1 &&
        this.resolution <= 2 &&
        this.period != "Not Selected"
      ) {
        if (event.toElement.innerText == "Add Data Points") {
          if (this.resolution == 2) {
            return;
          }
          this.resolution += 1;
          this.isLoading = true;
        } else {
          if (this.resolution == 1) {
            return;
          }
          this.resolution -= 1;
          this.isLoading = true;
        }
        frappe
          .call({
            method:
              "steelpipes.sp_dashboard.page.havenir_insight.havenir_insight.generate_total_pipe_labels_and_data_sets",
            args: {
              period: this.period,
              resolution: this.resolution
            }
          })
          .then(r => {
            this.total_pipe_sold_data = r.message[0];
          })
          .then(r => {
            this.total_pipe_sold_chart = new frappe.Chart("#totalPipeSold", {
              data: this.total_pipe_sold_data,
              title: "Total Pipes Sold in MT",
              type: "line",
              // height: 350,
              lineOptions: {
                dotSize: 6, // default: 4
                regionFill: 1, // default: 0
                xIsSeries: true,
                heatline: 1 // default: 0
              },
              tooltipOptions: {
                formatTooltipX: d => {
                  if (
                    this.resolution == 2 &&
                    this.period.includes("Month") &&
                    !d.includes("Week")
                  ) {
                    return "Day " + d;
                  } else {
                    return d;
                  }
                },
                formatTooltipY: d => d + " MT"
              },
              colors: ["green"]
              // isNavigable: true
            });
          })
          .then(r => {
            this.isLoading = false;
          });
      }
    },
    exportChart: function() {
      if (this.period != "Not Selected") {
        this.total_pipe_sold_chart.export();
        this.individual_pipe_sold_chart.export();
        this.thickness_pipe_sold_chart.export();
      }
    }
  },
  mounted() {}
};
</script>
