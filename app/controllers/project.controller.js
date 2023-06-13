const db = require("../models");
const Project = db.project;

// API for add project
exports.addProject = async (req, res) => {
    try {
        console.log("called add project");

        const {
            status,
            projectName,
            projectDescription,
            projectDuration,
            portfolioId,
            projectOwner,
            projectedStartDate,
            projectedCompletionDate
        } = req.body;

        // Generate unique projectId
        const projectId = await generateProjectId();

        const newProject = new Project({
            projectId,
            status,
            projectName,
            projectDescription,
            projectDuration,
            portfolioId,
            projectOwner,
            projectedStartDate,
            projectedCompletionDate
        });

        await newProject.save();

        res.status(201).json({ message: "Successfully added", projectId });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// API for project listing
exports.getProjectList = async (req, res) => {
    try {
        console.log('called list all project');
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API for update project
exports.updateProject = async (req, res) => {
    try {
        console.log('called update project');
        const { projectId } = req.params;
        const updateData = req.body;

        const updatedProject = await Project.findOneAndUpdate(
            { projectId: projectId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API for updating project status
exports.updateProjectStatus = async (req, res) => {
    try {
        console.log('called update project status');
        const { projectId } = req.params;
        const { status } = req.body;

        const project = await Project.findOne({ projectId });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.status = status;

        await project.save();

        res.json({ message: 'Project status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// API for deleting project
exports.deleteProject = async (req, res) => {
    try {
        console.log('called delete project');
        const { projectId } = req.params;

        const deletedProject = await Project.findOneAndDelete({ projectId });

        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// API for taking project details by passing project id
exports.getProjectDetails = async (req, res) => {
    try {
        console.log('called get single project by id');
        const { projectId } = req.params;

        const project = await Project.findOne({ projectId });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// Function to generate unique project ID
async function generateProjectId() {
    const lastProject = await Project.findOne({}, {}, { sort: { projectId: -1 } });

    if (lastProject) {
        const lastId = parseInt(lastProject.projectId);
        const newId = (lastId + 1).toString().padStart(4, "0");
        if (newId >= "1000") {
            return newId;
        }
    }
    return "1000";
}
