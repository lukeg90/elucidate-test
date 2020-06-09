<template>
    <div id="app">
        <div class="filter">
            <h2>Filter by:</h2>
            <input
                type="checkbox"
                id="published"
                value="true"
                v-model="publishedFilter"
            />
            <label for="published">Already published</label>
            <h3>Type:</h3>
            <input
                type="checkbox"
                id="extended"
                value="extended"
                v-model="types"
            />
            <label for="extended">Extended</label>
            <input
                type="checkbox"
                id="intermediate"
                value="intermediate"
                v-model="types"
            />
            <label for="intermediate">Intermediate</label>
            <input
                type="checkbox"
                id="primary"
                value="primary"
                v-model="types"
            />
            <label for="primary">Primary</label>
            <h3>Score:</h3>
            <label for="minScore">Minimum:</label>
            <input type="number" id="minScore" v-model="minScore" />
            <label for="maxScore">Maximum:</label>
            <input type="number" id="maxScore" v-model="maxScore" /><br />
            <label for="bank-name">Bank name:</label>
            <input type="text" id="bank-name" v-model="bankQuery" /><br />
            <button @click="reset">Reset Filters</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Bank Name</th>
                    <th>BIC</th>
                    <th>Report Score</th>
                    <th>Type</th>
                    <th>Created</th>
                    <th>Published</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="report in filteredReports" :key="report.uuid">
                    <td>{{ report.body.bankName }}</td>
                    <td>{{ report.body.bankBIC[0] }}</td>
                    <td>{{ report.body.reportScore }}</td>
                    <td>{{ report.body.type }}</td>
                    <td>{{ report.createdAt }}</td>
                    <td>{{ report.publishedAt }}</td>
                </tr>
            </tbody>
        </table>
        <div class="pagination"></div>
    </div>
</template>

<script>
import reports from "../public/reports.json";

// todo
// 1. pagination
// 2. ability to apply multiple filters
// 3. add style to form - flexbox?

export default {
    name: "App",
    data: () => {
        return {
            reports: reports,
            minScore: null,
            maxScore: null,
            bankQuery: "",
            publishedFilter: false,
            types: []
        };
    },
    computed: {
        filteredReports() {
            let reports = this.reports;
            if (this.publishedFilter) {
                reports = reports.filter(
                    report => Date.parse(report.publishedAt) < new Date()
                );
            }
            if (this.types.length !== 0) {
                reports = reports.filter(report =>
                    this.types.includes(report.body.type)
                );
            }
            if (this.minScore) {
                reports = reports.filter(
                    report => report.body.reportScore >= this.minScore
                );
            }
            if (this.maxScore) {
                reports = reports.filter(
                    report => report.body.reportScore <= this.maxScore
                );
            }
            if (this.bankQuery) {
                let regexString = this.bankQuery;
                let regex = new RegExp(regexString, "gi");
                reports = reports.filter(report =>
                    regex.test(report.body.bankName)
                );
            }
            return reports;
        }
    },
    methods: {
        reset() {
            this.publishedFilter = false;
            this.minScore = null;
            this.maxScore = null;
            this.bankQuery = "";
            this.types = [];
        }
    }
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
}

table {
    border-collapse: collapse;
    border: 3px solid #2c3e50;
}

th {
    text-align: left;
    background: #0e2e1c;
    color: #caebd8;
    padding: 10px;
}

td {
    text-align: left;
    padding: 8px;
    border: 2px solid #2c3e50;
}

button {
    background: #2c3e50;
    color: #caebd8;
    font-size: 17px;
    /* border-radius: 20px; */
    cursor: pointer;
    margin: 5px;
    padding: 10px;
}
</style>
