const mongoose = require("mongoose");

const cveSchema = new mongoose.Schema({
    vulnerabilities: [
        {
            cve: {
                id: { type: String, required: true },
                sourceIdentifier: { type: String, required: true },
                published: { type: Date, required: true },
                lastModified: { type: Date, required: true },
                vulnStatus: { type: String, required: true },
                evaluatorSolution: { type: String },
                evaluatorImpact: { type: String },
                descriptions: [
                    {
                        lang: { type: String, required: true },
                        value: { type: String, required: true }
                    }
                ],
                metrics: {
                    cvssMetricV2: [
                        {
                            source: { type: String },
                            type: { type: String },
                            cvssData: {
                                version: { type: String },
                                vectorString: { type: String },
                                accessVector: { type: String },
                                accessComplexity: { type: String },
                                authentication: { type: String },
                                confidentialityImpact: { type: String },
                                integrityImpact: { type: String },
                                availabilityImpact: { type: String },
                                baseScore: { type: Number }
                            },
                            baseSeverity: { type: String },
                            exploitabilityScore: { type: Number },
                            impactScore: { type: Number },
                            acInsufInfo: { type: Boolean },
                            obtainAllPrivilege: { type: Boolean },
                            obtainUserPrivilege: { type: Boolean },
                            obtainOtherPrivilege: { type: Boolean },
                            userInteractionRequired: { type: Boolean }
                        }
                    ]
                },
                weaknesses: [
                    {
                        source: { type: String },
                        type: { type: String },
                        description: [
                            {
                                lang: { type: String },
                                value: { type: String }
                            }
                        ]
                    }
                ],
                configurations: [
                    {
                        nodes: [
                            {
                                operator: { type: String },
                                negate: Boolean,
                                cpeMatch: [
                                    {
                                        vulnerable: { type: Boolean },
                                        criteria: { type: String },
                                        matchCriteriaId: { type: String }
                                    }
                                ]
                            }
                        ]
                    }
                ],
                references: [
                    {
                        url: { type: String, required: true },
                        source: { type: String, required: true }
                    }
                ]
            }
        }
    ]
});

module.exports = mongoose.model('Cve', cveSchema);