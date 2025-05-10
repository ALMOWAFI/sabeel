"""
QuranXBlock - A specialized XBlock for Quran study and recitation
with integrated tajweed visualization and tafsir references.
"""

import pkg_resources
from web_fragments.fragment import Fragment
from xblock.core import XBlock
from xblock.fields import Scope, String, Boolean, Integer, Dict
from xblockutils.resources import ResourceLoader
from xblockutils.studio_editable import StudioEditableXBlockMixin

loader = ResourceLoader(__name__)

class QuranXBlock(StudioEditableXBlockMixin, XBlock):
    """
    XBlock providing interactive Quran study capabilities
    """
    display_name = String(
        display_name="Display Name",
        help="Name of the component in the edX studio",
        scope=Scope.settings,
        default="Quran Interactive Viewer"
    )
    
    surah_number = Integer(
        display_name="Surah Number",
        help="The number of Surah (chapter) in the Quran (1-114)",
        scope=Scope.content,
        default=1
    )
    
    ayah_range = String(
        display_name="Ayah Range",
        help="Range of verses to show, e.g., '1-7'",
        scope=Scope.content,
        default="1-7"
    )
    
    enable_tajweed = Boolean(
        display_name="Enable Tajweed Visualization",
        help="Display tajweed rules visualization",
        scope=Scope.content,
        default=True
    )
    
    enable_tafsir = Boolean(
        display_name="Enable Tafsir",
        help="Show tafsir (exegesis) alongside verses",
        scope=Scope.content,
        default=True
    )
    
    tafsir_sources = Dict(
        display_name="Tafsir Sources",
        help="Sources of tafsir to display",
        scope=Scope.content,
        default={"ibn-kathir": True, "tabari": False, "qurtubi": False}
    )
    
    recitation_style = String(
        display_name="Recitation Style",
        help="Style of Quranic recitation",
        scope=Scope.content,
        default="hafs",
        values=["hafs", "warsh", "qaloon"]
    )
    
    editable_fields = [
        'display_name', 'surah_number', 'ayah_range', 
        'enable_tajweed', 'enable_tafsir', 'tafsir_sources',
        'recitation_style'
    ]
    
    def resource_string(self, path):
        """Get the content of a resource"""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")
    
    def student_view(self, context=None):
        """The primary view of the QuranXBlock, shown to students"""
        html = loader.render_django_template(
            'templates/quran_xblock.html',
            {
                'self': self,
                'surah_number': self.surah_number,
                'ayah_range': self.ayah_range,
                'enable_tajweed': self.enable_tajweed,
                'enable_tafsir': self.enable_tafsir,
                'tafsir_sources': self.tafsir_sources,
                'recitation_style': self.recitation_style
            }
        )
        
        frag = Fragment(html)
        frag.add_css(self.resource_string("static/css/quran_xblock.css"))
        frag.add_javascript(self.resource_string("static/js/quran_xblock.js"))
        frag.initialize_js('QuranXBlock')
        return frag
    
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("QuranXBlock",
             """<quran_xblock surah_number="1" ayah_range="1-7" enable_tajweed="true" />"""),
            ("QuranXBlock with Tafsir",
             """<quran_xblock surah_number="36" ayah_range="1-10" enable_tafsir="true" />"""),
        ]
