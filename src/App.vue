<template>
    <div id="app">
        <div class="filter">
            <h2>Filter by:</h2>
            <button @click="published">Already published</button><br />
            <h3>Type:</h3>
            <button @click="extended">Extended</button>
            <button @click="intermediate">Intermediate</button>
            <button @click="primary">Primary</button><br />
            <h3>Score:</h3>
            From <input type="number" v-model="minScore" /> to
            <input type="number" v-model="maxScore" />
            <button @click="scoreRange">Check</button>
            <h2>Search by:</h2>
            <label for="bank-name">Bank name:</label>
            <input type="text" id="bank-name" v-model="bankQuery" />
            <button @click="nameMatch">Search</button>
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

export default {
    name: "App",
    data: () => {
        return {
            reports: reports,
            filteredReports: reports,
            minScore: null,
            maxScore: null,
            bankQuery: ""
        };
    },
    methods: {
        published() {
            this.filteredReports = this.reports.filter(
                report => Date.parse(report.publishedAt) < new Date()
            );
        },
        extended() {
            this.filteredReports = this.reports.filter(
                report => report.body.type == "extended"
            );
        },
        intermediate() {
            this.filteredReports = this.reports.filter(
                report => report.body.type == "intermediate"
            );
        },
        primary() {
            this.filteredReports = this.reports.filter(
                report => report.body.type == "primary"
            );
        },
        scoreRange() {
            this.filteredReports = this.reports.filter(
                report =>
                    report.body.reportScore >= this.minScore &&
                    report.body.reportScore <= this.maxScore
            );
        },
        nameMatch() {
            this.filteredReports = this.reports.filter(report =>
                report.body.bankName.startsWith(this.bankQuery)
            );
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
    font-size: 20px;
    border-radius: 20px;
    cursor: pointer;
    margin: 5px;
    padding: 10px;
}
</style>
