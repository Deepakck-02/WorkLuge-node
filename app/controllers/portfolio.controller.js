const db = require("../models");
const Portfolio = db.portfolio;

// API for Portfolio Listing

// exports.getPortfolioList = async (req, res) => {
//     try {
//         console.log("called list portfolio");
//
//         const portfolios = await Portfolio.find();
//
//         const response = portfolios.map(portfolio => {
//             const { projects, ...portfolioData } = portfolio.toObject();
//             return {
//                 ...portfolioData,
//                 createdAt: { $date: portfolio.createdAt },
//                 updatedAt: { $date: portfolio.updatedAt }
//             };
//         });
//
//         res.json(response);
//     } catch (error) {
//         res.status(500).send({ message: error.message });
//     }
// };

exports.getPortfolioList = async (req, res) => {
    try {
        console.log("called list portfolio");

        const onset = parseInt(req.body.onset); // Get the onset (starting index)
        const offset = parseInt(req.body.offset); // Get the offset (number of portfolios to retrieve)

        const portfolios = await Portfolio.aggregate([
            {
                $lookup: {
                    from: "projects",
                    localField: "projectId.ids",
                    foreignField: "projectId",
                    as: "projects"
                }
            },
            {
                $project: {
                    _id: 0,
                    portfolioId: 1,
                    portfolioDescription: 1,
                    status: 1,
                    portfolioName: 1,
                    createdAt: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$createdAt" } },
                    updatedAt: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$updatedAt" } },
                    projects: {
                        $cond: {
                            if: { $eq: ["$projects", []] },
                            then: [],
                            else: {
                                $map: {
                                    input: "$projects",
                                    as: "project",
                                    in: { id: "$$project.projectId", name: "$$project.projectName" }
                                }
                            }
                        }
                    }
                }
            },
            {
                $skip: onset // Skip the specified number of documents
            },
            {
                $limit: offset // Limit the number of documents in the result
            }
        ]);

        res.json(portfolios);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// API for listing portfolio ids and name

exports.getPortfolioNames = async (req, res) => {
    try {
        console.log("called list portfolio names");

        const portfolios = await Portfolio.aggregate([
            {
                $project: {
                    _id: 0,
                    portfolioId: 1,
                    portfolioName: 1
                }
            }
        ]);

        res.json(portfolios);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// API for get a single portfolio
exports.getPortfolioById = async (req, res) => {
    try {
        console.log('called get portfolio by id');

        const { portfolioId } = req.params;

        const portfolio = await Portfolio.aggregate([
            { $match: { portfolioId } },
            {
                $lookup: {
                    from: "projects",
                    localField: "projectId.ids",
                    foreignField: "projectId",
                    as: "projects"
                }
            },
            {
                $project: {
                    _id: 0,
                    portfolioId: 1,
                    portfolioDescription: 1,
                    status: 1,
                    portfolioName: 1,
                    createdAt: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$createdAt" } },
                    updatedAt: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$updatedAt" } },
                    projects: {
                        $cond: {
                            if: { $eq: ["$projects", []] },
                            then: [],
                            else: {
                                $map: {
                                    input: "$projects",
                                    as: "project",
                                    in: { id: "$$project.projectId", name: "$$project.projectName" }
                                }
                            }
                        }
                    }

                }
            }
        ]);

        if (portfolio.length === 0) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

        res.json(portfolio[0]);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch portfolio", error: error.message });
    }
};


// API for Adding Portfolio
exports.addPortfolio = async (req, res) => {
    try {
        console.log("called add portfolio");

        const {
            portfolioDescription,
            status,
            portfolioManager,
            portfolioName,
            projectId
        } = req.body;

        // Generate unique portfolioId
        const portfolioId = await generatePortfolioId();

        const portfolioManagerId = portfolioManager._id;
        const projectIds = projectId.ids;

        const newPortfolio = new Portfolio({
            portfolioId,
            portfolioDescription,
            status,
            portfolioManager: { _id: portfolioManagerId, name: portfolioManager.name },
            portfolioName,
            projectId: { ids: projectIds }
        });

        await newPortfolio.save();

        res.status(201).json({ message: "Successfully added", portfolioId });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// API for Updating Portfolio
exports.updatePortfolio = async (req, res) => {
    try {
        console.log('called update portfolio');

        const { portfolioId } = req.params;
        const { portfolioDescription, status, portfolioName, projectId } = req.body;

        const portfolio = await Portfolio.findOne({ portfolioId });

        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

        portfolio.portfolioDescription = portfolioDescription;
        portfolio.status = status;
        portfolio.portfolioName = portfolioName;
        portfolio.projectId.ids = projectId.ids;

        await portfolio.save();

        res.json({ message: "Successfully updated" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// API for updating status of portfolio
exports.updatePortfolioStatus = async (req, res) => {
    try {
        console.log('called portfolio status update');
        const { portfolioId } = req.params;
        const { status } = req.body;

        const portfolio = await Portfolio.findOne({ portfolioId });

        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

        portfolio.status = status;
        await portfolio.save();
        res.json({ message: "Portfolio status updated successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// API for Deleting Portfolio

exports.deletePortfolio = async (req, res) => {
    try {
        console.log("called delete portfolios");
        const { portfolioIds } = req.body;

        const portfolios = await Portfolio.deleteMany({ portfolioId: { $in: portfolioIds } });

        if (portfolios.deletedCount === 0) {
            return res.status(404).json({ error: 'Portfolios not found' });
        }

        res.json({ message: "Deleted Successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};



// API for adding new project IDs to the portfolio
exports.addProjectIdsToPortfolio = async (req, res) => {
    try {
        console.log('called add project ids in portfolio');
        const { portfolioId } = req.params;
        const { projectIds } = req.body;

        const portfolio = await Portfolio.findOne({ portfolioId });

        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

        portfolio.projectId.ids.push(...projectIds);

        await portfolio.save();

        res.json({ message: "Successfully added project IDs to the portfolio" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// API for deleting the project id from a portfolio
exports.deleteProjectIdsFromPortfolio = async (req, res) => {
    try {
        console.log('called delete project from portfolio');
        const { portfolioId } = req.params;
        const { projectIdsToDelete } = req.body;

        const portfolio = await Portfolio.findOne({ portfolioId });

        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

        portfolio.projectId.ids = portfolio.projectId.ids.filter(
            (id) => !projectIdsToDelete.includes(id)
        );

        await portfolio.save();

        res.json({ message: "Project IDs deleted from portfolio successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.PortfolioList = async (req, res) => {
    try {
        console.log("called list portfolio");

        const portfolios = await Portfolio.aggregate([
            {
                $lookup: {
                    from: "projects",
                    localField: "projectId.ids",
                    foreignField: "projectId",
                    as: "projects"
                }
            },
            {
                $project: {
                    _id: 0,
                    portfolioId: 1,
                    portfolioDescription: 1,
                    status: 1,
                    portfolioName: 1,
                    createdAt: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$createdAt" } },
                    updatedAt: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$updatedAt" } },
                    projects: {
                        $map: {
                            input: "$projects",
                            as: "project",
                            in: { id: "$$project.projectId", name: "$$project.projectName" }
                        }
                    }
                }
            }
        ]);

        res.render('portfolio', { portfolios });
        // res.json(response);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// Function to generate unique portfolio ID
async function generatePortfolioId() {
    const lastPortfolio = await Portfolio.findOne({}, {}, { sort: { portfolioId: -1 } });

    if (lastPortfolio) {
        const lastId = parseInt(lastPortfolio.portfolioId);
        return (lastId + 1).toString().padStart(4, "0");
    }

    return "0001";
}

